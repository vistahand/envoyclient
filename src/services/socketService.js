import io from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
        withCredentials: true,
        transports: ["websocket"],
      });

      this.socket.on("connect", () => {
        this.connected = true;
        console.log("Socket connected");
      });

      this.socket.on("disconnect", () => {
        this.connected = false;
        console.log("Socket disconnected");
      });

      this.socket.on("error", (error) => {
        console.error("Socket error:", error);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  // Join user's room for private notifications
  joinUserRoom(userId) {
    if (this.socket && userId) {
      this.socket.emit("join", userId);
    }
  }

  // Listen for notifications
  onNotification(callback) {
    if (this.socket) {
      this.socket.on("notification", callback);
    }
  }

  // Listen for email verification status
  onEmailVerificationStatus(callback) {
    if (this.socket) {
      this.socket.on("email_verification_status", callback);
    }
  }

  // Listen for registration status
  onRegistrationStatus(callback) {
    if (this.socket) {
      this.socket.on("registration_status", callback);
    }
  }

  // Listen for payment status
  onPaymentStatus(callback) {
    if (this.socket) {
      this.socket.on("payment_status", callback);
    }
  }

  // Listen for shipment status
  onShipmentStatus(callback) {
    if (this.socket) {
      this.socket.on("shipment_status", callback);
    }
  }

  // Remove event listener
  off(event) {
    if (this.socket) {
      this.socket.off(event);
    }
  }

  // Check connection status
  isConnected() {
    return this.connected;
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
