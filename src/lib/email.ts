import nodemailer from 'nodemailer'
import type { Order } from './types'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
})

const FROM_EMAIL = process.env.EMAIL_USER || ''
const BUSINESS_EMAIL = 'etoi.fragrances@gmail.com'

function buildOrderConfirmationHTML(order: Order): string {
  const itemsHTML = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px;border-bottom:1px solid #e5e5e5;font-size:14px;color:#333;">
          <img src="${item.productImage}" alt="${item.productName}" style="width:60px;height:60px;object-fit:cover;border-radius:4px;" />
        </td>
        <td style="padding:10px;border-bottom:1px solid #e5e5e5;font-size:14px;color:#333;">${item.productName}</td>
        <td style="padding:10px;border-bottom:1px solid #e5e5e5;font-size:14px;color:#333;">${item.quantity}</td>
        <td style="padding:10px;border-bottom:1px solid #e5e5e5;font-size:14px;color:#333;text-align:right;">PKR ${(item.price * item.quantity).toLocaleString()}</td>
      </tr>
    `
    )
    .join('')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f0;font-family:'Georgia','Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f0;padding:20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
          <tr>
            <td style="background-color:#1a1a1a;padding:30px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:28px;letter-spacing:3px;font-weight:300;">ÉTOI</h1>
              <p style="color:#c9a96e;margin:5px 0 0;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Fragrances</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#1a1a1a;font-size:22px;margin:0 0 5px;font-weight:400;">Thank You for Your Order</h2>
              <p style="color:#666;font-size:14px;margin:0 0 20px;">Dear ${order.customerName},</p>
              <p style="color:#666;font-size:14px;margin:0 0 20px;">Your order has been received and is being processed. Here are the details:</p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:25px;">
                <tr>
                  <td style="padding:8px 0;font-size:13px;color:#888;">Order Number</td>
                  <td style="padding:8px 0;font-size:13px;color:#1a1a1a;font-weight:bold;text-align:right;">${order.orderNumber}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:13px;color:#888;">Date</td>
                  <td style="padding:8px 0;font-size:13px;color:#1a1a1a;text-align:right;">${new Date(order.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:13px;color:#888;">Delivery City</td>
                  <td style="padding:8px 0;font-size:13px;color:#1a1a1a;text-align:right;">${order.city}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:13px;color:#888;">Payment Method</td>
                  <td style="padding:8px 0;font-size:13px;color:#1a1a1a;text-align:right;text-transform:capitalize;">${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Direct Bank Transfer'}</td>
                </tr>
              </table>

              <h3 style="color:#1a1a1a;font-size:16px;margin:0 0 15px;font-weight:400;border-bottom:1px solid #e5e5e5;padding-bottom:10px;">Order Items</h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                <thead>
                  <tr style="background-color:#f9f9f5;">
                    <th style="padding:10px;text-align:left;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">Image</th>
                    <th style="padding:10px;text-align:left;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">Product</th>
                    <th style="padding:10px;text-align:center;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">Qty</th>
                    <th style="padding:10px;text-align:right;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHTML}
                </tbody>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
                <tr>
                  <td style="padding:8px 0;font-size:14px;color:#666;">Subtotal</td>
                  <td style="padding:8px 0;font-size:14px;color:#1a1a1a;text-align:right;">PKR ${order.subtotal.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:14px;color:#666;">Delivery</td>
                  <td style="padding:8px 0;font-size:14px;color:#1a1a1a;text-align:right;">PKR ${order.delivery.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:16px;color:#1a1a1a;font-weight:bold;border-top:2px solid #1a1a1a;">Total</td>
                  <td style="padding:8px 0;font-size:16px;color:#1a1a1a;font-weight:bold;text-align:right;border-top:2px solid #1a1a1a;">PKR ${order.total.toLocaleString()}</td>
                </tr>
              </table>

              <p style="color:#666;font-size:14px;margin:30px 0 10px;">Estimated delivery: 3-5 business days within Pakistan.</p>
              <p style="color:#666;font-size:14px;margin:0;">If you have any questions, please contact us at <a href="mailto:${BUSINESS_EMAIL}" style="color:#c9a96e;text-decoration:none;">${BUSINESS_EMAIL}</a></p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#1a1a1a;padding:25px;text-align:center;">
              <p style="color:#888;font-size:12px;margin:0 0 10px;">Follow us</p>
              <p style="margin:0;">
                <a href="https://instagram.com/etoi.fragrances" style="color:#c9a96e;text-decoration:none;margin:0 10px;font-size:13px;">Instagram</a>
                <a href="https://tiktok.com/@etoi.fragrances" style="color:#c9a96e;text-decoration:none;margin:0 10px;font-size:13px;">TikTok</a>
              </p>
              <p style="color:#666;font-size:11px;margin:15px 0 0;">&copy; 2026 ÉTOI Fragrances. All rights reserved.</p>
              <p style="color:#666;font-size:11px;margin:5px 0 0;">${BUSINESS_EMAIL} | <a href="https://wa.me/923282147535" style="color:#c9a96e;text-decoration:none;">+92 328-2147535</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function buildOrderNotificationHTML(order: Order): string {
  const itemsHTML = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #e5e5e5;font-size:13px;">${item.productName}</td>
        <td style="padding:8px;border-bottom:1px solid #e5e5e5;font-size:13px;text-align:center;">${item.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #e5e5e5;font-size:13px;text-align:right;">PKR ${(item.price * item.quantity).toLocaleString()}</td>
      </tr>
    `
    )
    .join('')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order Notification</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f0;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f0;padding:20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="background-color:#1a1a1a;padding:25px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:22px;letter-spacing:2px;">New Order Received</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:30px;">
              <h3 style="color:#1a1a1a;font-size:16px;margin:0 0 15px;border-bottom:1px solid #e5e5e5;padding-bottom:10px;">Customer Details</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr><td style="padding:4px 0;font-size:13px;color:#888;">Name</td><td style="padding:4px 0;font-size:13px;color:#1a1a1a;">${order.customerName}</td></tr>
                <tr><td style="padding:4px 0;font-size:13px;color:#888;">Email</td><td style="padding:4px 0;font-size:13px;color:#1a1a1a;">${order.customerEmail}</td></tr>
                <tr><td style="padding:4px 0;font-size:13px;color:#888;">Phone</td><td style="padding:4px 0;font-size:13px;color:#1a1a1a;">${order.customerPhone}</td></tr>
                <tr><td style="padding:4px 0;font-size:13px;color:#888;">Address</td><td style="padding:4px 0;font-size:13px;color:#1a1a1a;">${order.address}</td></tr>
                <tr><td style="padding:4px 0;font-size:13px;color:#888;">City</td><td style="padding:4px 0;font-size:13px;color:#1a1a1a;">${order.city}</td></tr>
              </table>

              <h3 style="color:#1a1a1a;font-size:16px;margin:0 0 15px;border-bottom:1px solid #e5e5e5;padding-bottom:10px;">Order Info</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr><td style="padding:4px 0;font-size:13px;color:#888;">Order Number</td><td style="padding:4px 0;font-size:13px;color:#1a1a1a;font-weight:bold;">${order.orderNumber}</td></tr>
                <tr><td style="padding:4px 0;font-size:13px;color:#888;">Payment Method</td><td style="padding:4px 0;font-size:13px;color:#1a1a1a;text-transform:capitalize;">${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Direct Bank Transfer'}</td></tr>
              </table>

              <h3 style="color:#1a1a1a;font-size:16px;margin:0 0 15px;border-bottom:1px solid #e5e5e5;padding-bottom:10px;">Items</h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                <thead>
                  <tr style="background-color:#f9f9f5;">
                    <th style="padding:8px;text-align:left;font-size:11px;color:#888;text-transform:uppercase;">Product</th>
                    <th style="padding:8px;text-align:center;font-size:11px;color:#888;text-transform:uppercase;">Qty</th>
                    <th style="padding:8px;text-align:right;font-size:11px;color:#888;text-transform:uppercase;">Total</th>
                  </tr>
                </thead>
                <tbody>${itemsHTML}</tbody>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:15px;">
                <tr><td style="padding:5px 0;font-size:13px;color:#666;">Subtotal</td><td style="padding:5px 0;font-size:13px;color:#1a1a1a;text-align:right;">PKR ${order.subtotal.toLocaleString()}</td></tr>
                <tr><td style="padding:5px 0;font-size:13px;color:#666;">Delivery</td><td style="padding:5px 0;font-size:13px;color:#1a1a1a;text-align:right;">PKR ${order.delivery.toLocaleString()}</td></tr>
                <tr><td style="padding:5px 0;font-size:14px;color:#1a1a1a;font-weight:bold;border-top:2px solid #1a1a1a;">Total</td><td style="padding:5px 0;font-size:14px;color:#1a1a1a;font-weight:bold;text-align:right;border-top:2px solid #1a1a1a;">PKR ${order.total.toLocaleString()}</td></tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function sendOrderConfirmation(order: Order): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"ÉTOI Fragrances" <${FROM_EMAIL}>`,
      to: order.customerEmail,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: buildOrderConfirmationHTML(order),
    })
    return true
  } catch {
    return false
  }
}

export async function sendOrderNotification(order: Order): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"ÉTOI Fragrances" <${FROM_EMAIL}>`,
      to: BUSINESS_EMAIL,
      subject: `New Order - ${order.orderNumber}`,
      html: buildOrderNotificationHTML(order),
    })
    return true
  } catch {
    return false
  }
}

export async function sendNewsletterNotification(email: string): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"ÉTOI Fragrances" <${FROM_EMAIL}>`,
      to: email,
      subject: 'Welcome to ÉTOI Fragrances',
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="margin:0;padding:0;background-color:#f5f5f0;font-family:'Georgia','Times New Roman',serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f0;padding:20px;">
            <tr><td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
                <tr><td style="background-color:#1a1a1a;padding:30px;text-align:center;">
                  <h1 style="color:#ffffff;margin:0;font-size:28px;letter-spacing:3px;font-weight:300;">ÉTOI</h1>
                  <p style="color:#c9a96e;margin:5px 0 0;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Fragrances</p>
                </td></tr>
                <tr><td style="padding:40px;">
                  <h2 style="color:#1a1a1a;font-size:22px;margin:0 0 10px;font-weight:400;">Welcome to ÉTOI</h2>
                  <p style="color:#666;font-size:14px;line-height:1.6;">Thank you for subscribing to our newsletter. You'll be the first to know about new launches, exclusive offers, and fragrance stories.</p>
                  <p style="color:#666;font-size:14px;line-height:1.6;">Stay tuned for something beautiful.</p>
                  <p style="color:#c9a96e;font-size:14px;margin-top:30px;">— ÉTOI Fragrances</p>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    })
  } catch {
    // subscriber welcome failure is non-critical
  }

  try {
    await transporter.sendMail({
      from: `"ÉTOI Website" <${FROM_EMAIL}>`,
      to: BUSINESS_EMAIL,
      subject: 'New Newsletter Subscriber',
      html: `
        <h2>New Newsletter Subscription</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p>Someone has subscribed to the ÉTOI newsletter.</p>
      `,
    })
    return true
  } catch {
    return false
  }
}

export async function sendContactNotification(
  name: string,
  email: string,
  subject: string,
  message: string
): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"ÉTOI Fragrances" <${FROM_EMAIL}>`,
      to: email,
      subject: `We received your message - ÉTOI Fragrances`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="margin:0;padding:0;background-color:#f5f5f0;font-family:'Georgia','Times New Roman',serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f0;padding:20px;">
            <tr><td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
                <tr><td style="background-color:#1a1a1a;padding:30px;text-align:center;">
                  <h1 style="color:#ffffff;margin:0;font-size:28px;letter-spacing:3px;font-weight:300;">ÉTOI</h1>
                  <p style="color:#c9a96e;margin:5px 0 0;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Fragrances</p>
                </td></tr>
                <tr><td style="padding:40px;">
                  <h2 style="color:#1a1a1a;font-size:22px;margin:0 0 10px;font-weight:400;">Thank You, ${name}</h2>
                  <p style="color:#666;font-size:14px;line-height:1.6;">We've received your message regarding <strong>"${subject}"</strong> and will get back to you as soon as possible.</p>
                  <p style="color:#666;font-size:14px;line-height:1.6;">Here's a copy of your message:</p>
                  <blockquote style="border-left:3px solid #c9a96e;padding:12px 20px;margin:15px 0;background:#f9f9f5;font-style:italic;color:#666;font-size:14px;">${message}</blockquote>
                  <p style="color:#c9a96e;font-size:14px;margin-top:30px;">— ÉTOI Fragrances</p>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    })
  } catch {
    // auto-reply failure is non-critical
  }

  try {
    await transporter.sendMail({
      from: `"ÉTOI Website" <${FROM_EMAIL}>`,
      to: BUSINESS_EMAIL,
      subject: `Contact Form: ${subject} - from ${name}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    })
    return true
  } catch {
    return false
  }
}
