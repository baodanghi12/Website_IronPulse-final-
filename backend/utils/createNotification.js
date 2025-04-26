// utils/createNotification.js
import Notification from '../models/notificationModel.js';

export const createNotification = async ({ title, link }) => {
    try {
      const notification = new Notification({ title, link });
      await notification.save();
      console.log('Notification created:', title);
    } catch (err) {
      console.error("Failed to create notification:", err.message);
    }
  };
  