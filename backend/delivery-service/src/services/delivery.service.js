// Mock delivery database (in-memory)
const deliveries = new Map();

class DeliveryService {
    async assignDelivery(orderId) {
        const deliveryId = `DEL-${Date.now()}`;
        const delivery = {
            id: deliveryId,
            orderId,
            partnerId: `PARTNER-${Math.floor(Math.random() * 100)}`,
            status: 'ASSIGNED',
            assignedAt: new Date(),
            estimatedArrival: new Date(Date.now() + 30 * 60000), // 30 minutes
            location: {
                lat: 40.7128 + (Math.random() - 0.5) * 0.1,
                lng: -74.0060 + (Math.random() - 0.5) * 0.1,
            },
        };

        deliveries.set(orderId, delivery);

        // Simulate delivery progress (DISABLED for manual admin control)
        // this.simulateDeliveryProgress(orderId);

        return delivery;
    }

    async getDeliveryStatus(orderId) {
        let delivery = deliveries.get(orderId);

        // DEMO MODE: Auto-create delivery if not found
        if (!delivery) {
            console.log(`✨ Demo: Auto-creating delivery for Order ${orderId}`);
            delivery = await this.assignDelivery(orderId);
        }

        return delivery;
    }

    async updateDeliveryStatus(deliveryId, status) {
        // Find delivery by deliveryId
        let delivery = null;
        for (const [orderId, del] of deliveries.entries()) {
            if (del.id === deliveryId) {
                delivery = del;
                break;
            }
        }

        if (!delivery) {
            throw { statusCode: 404, message: 'Delivery not found' };
        }

        delivery.status = status;
        delivery.updatedAt = new Date();

        if (status === 'DELIVERED') {
            delivery.deliveredAt = new Date();
        }

        return delivery;
    }

    async getDeliveryPartnerOrders(partnerId) {
        const partnerDeliveries = [];
        for (const delivery of deliveries.values()) {
            if (delivery.partnerId === partnerId) {
                partnerDeliveries.push(delivery);
            }
        }
        return partnerDeliveries;
    }

    async getAllDeliveries() {
        return Array.from(deliveries.values());
    }

    // Simulate delivery progress
    simulateDeliveryProgress(orderId) {
        const statuses = ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'NEARBY', 'DELIVERED'];
        let currentIndex = 0;

        const interval = setInterval(() => {
            const delivery = deliveries.get(orderId);
            if (!delivery || currentIndex >= statuses.length - 1) {
                clearInterval(interval);
                return;
            }

            currentIndex++;
            delivery.status = statuses[currentIndex];
            delivery.updatedAt = new Date();

            // Update location
            delivery.location.lat += (Math.random() - 0.5) * 0.01;
            delivery.location.lng += (Math.random() - 0.5) * 0.01;

            console.log(`📍 Delivery ${delivery.id} status: ${delivery.status}`);
        }, 10000); // Update every 10 seconds
    }
}

module.exports = new DeliveryService();
