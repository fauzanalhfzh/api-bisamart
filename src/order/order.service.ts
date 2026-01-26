import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { PaymentService } from '../common/payment.service';
import { User, OrderStatus } from '@prisma/client';
import { CreateOrderResponse } from '../model/order.model';
import { v4 as uuid } from 'uuid';

@Injectable()
export class OrderService {
    constructor(
        private prismaService: PrismaService,
        private paymentService: PaymentService,
    ) { }

    async checkout(user: User, request: { address_id: number }): Promise<CreateOrderResponse> {
        // 0. Validate Address
        const address = await this.prismaService.address.findFirst({
            where: {
                id: request.address_id,
                user_id: user.id
            }
        });

        if (!address) {
            throw new HttpException('Address not found', 404);
        }

        // 1. Get Cart Items
        const cartItems = await this.prismaService.cart.findMany({
            where: {
                customer_id: user.id, // Assuming user.id matches customer_id for simplicity, ideally lookup Customer first
            },
            include: {
                Product: true,
            },
        });

        if (cartItems.length === 0) {
            throw new HttpException('Cart is empty', 400);
        }

        // 2. Calculate Total
        let totalItemPrice = 0;
        for (const item of cartItems) {
            totalItemPrice += item.quantity * item.Product.price;
        }

        const shippingCost = 15000; // Flat rate for now
        const totalAmount = totalItemPrice + shippingCost;

        // 3. Create Order
        // Need to find Customer ID first if User.id != Customer.id
        // But schema says User @relation("user_customer", fields: [user_id], references: [id]) in Customer
        // So Customer table has user_id. We need to find customer record.
        const customer = await this.prismaService.customer.findUnique({
            where: { user_id: user.id },
        });

        if (!customer) {
            throw new HttpException('Customer profile not found', 404);
        }

        const orderId = uuid();

        // Database Transaction
        const order = await this.prismaService.$transaction(async (prisma) => {
            // Create Order
            const newOrder = await prisma.order.create({
                data: {
                    id: orderId,
                    customer_id: customer.id,
                    address_id: address.id,
                    total_amount: totalAmount,
                    shipping_cost: shippingCost,
                    status: OrderStatus.PENDING,
                    OrderItems: {
                        create: cartItems.map((item) => ({
                            product_id: item.product_id,
                            product_name: item.Product.name,
                            product_price: item.Product.price,
                            quantity: item.quantity,
                            note: item.note,
                        })),
                    },
                },
            });

            // Clear Cart
            await prisma.cart.deleteMany({
                where: {
                    customer_id: customer.id,
                },
            });

            return newOrder;
        });

        // 4. Create Snap Transaction
        const snapParams = {
            transaction_details: {
                order_id: order.id,
                gross_amount: order.total_amount,
            },
            customer_details: {
                first_name: user.name,
                email: user.email,
                phone: user.phone_number,
                shipping_address: {
                    first_name: user.name,
                    email: user.email,
                    phone: user.phone_number,
                    address: address.address_line,
                    city: address.city,
                    postal_code: address.postal_code
                }
            },
        };

        const snapResponse = await this.paymentService.createTransaction(snapParams);

        // 5. Update Order with Snap Token
        const updatedOrder = await this.prismaService.order.update({
            where: { id: order.id },
            data: {
                snap_token: snapResponse.token,
                snap_redirect_url: snapResponse.redirect_url,
            },
        });

        return {
            id: updatedOrder.id,
            status: updatedOrder.status,
            total_amount: updatedOrder.total_amount,
            snap_token: updatedOrder.snap_token,
            snap_redirect_url: updatedOrder.snap_redirect_url
        };
    }

    async handleNotification(payload: any) {
        const orderId = payload.order_id;
        const transactionStatus = payload.transaction_status;
        const fraudStatus = payload.fraud_status;

        const order = await this.prismaService.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            throw new HttpException('Order not found', 404);
        }

        let newStatus: OrderStatus = order.status;

        if (transactionStatus == 'capture') {
            if (fraudStatus == 'challenge') {
                // TODO set transaction status on your database to 'challenge'
                // and response with 200 OK
                newStatus = OrderStatus.PENDING;
            } else if (fraudStatus == 'accept') {
                // TODO set transaction status on your database to 'success'
                // and response with 200 OK
                newStatus = OrderStatus.ACCEPTED;
            }
        } else if (transactionStatus == 'settlement') {
            // TODO set transaction status on your database to 'success'
            // and response with 200 OK
            newStatus = OrderStatus.ACCEPTED;
        } else if (transactionStatus == 'cancel' ||
            transactionStatus == 'deny' ||
            transactionStatus == 'expire') {
            // TODO set transaction status on your database to 'failure'
            // and response with 200 OK
            newStatus = OrderStatus.CANCELLED;
        } else if (transactionStatus == 'pending') {
            // TODO set transaction status on your database to 'pending' / waiting payment
            // and response with 200 OK
            newStatus = OrderStatus.PENDING;
        }

        if (newStatus !== order.status) {
            await this.prismaService.order.update({
                where: { id: orderId },
                data: { status: newStatus }
            });
        }


        return { status: 'ok' };
    }

    async getMerchantOrders(user: User) {
        // Check if user is a merchant
        if (user.roles !== 'MERCHANT') {
            throw new HttpException('Hasus akun Merchant', 403);
        }

        const merchant = await this.prismaService.merchant.findUnique({
            where: { user_id: user.id }
        });

        if (!merchant) {
            throw new HttpException('Merchant profile not found', 404);
        }

        // Find orders containing products from this merchant
        // This is a bit complex in Prisma. We need to find Orders where OrderItems have product_id belonging to merchant.
        // Ideally Order should have merchant_id if it's single merchant checkout. 
        // Assuming Multi-Merchant: OrderItems -> Product -> merchant_id

        // Simplification: Get all orders where ANY item is from this merchant
        const orders = await this.prismaService.order.findMany({
            where: {
                OrderItems: {
                    some: {
                        Product: {
                            merchant_id: merchant.id
                        }
                    }
                }
            },
            include: {
                Customer: true,
                OrderItems: {
                    where: {
                        Product: {
                            merchant_id: merchant.id
                        }
                    },
                    include: {
                        Product: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });


        return orders;
    }

    async getCourierOrders(user: User) {
        if (user.roles !== 'COURIER') {
            throw new HttpException('Hasus akun Courier', 403);
        }

        // Courier sees orders that are 'ACCEPTED' (Ready for pickup)
        const orders = await this.prismaService.order.findMany({
            where: {
                status: OrderStatus.ACCEPTED
            },
            include: {
                Customer: true,
                Address: true,
                OrderItems: {
                    include: {
                        Product: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        return orders;
    }
}
