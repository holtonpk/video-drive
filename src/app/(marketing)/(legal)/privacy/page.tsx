import React from "react";
import ReactMarkdown from "react-markdown";
import {Metadata} from "next";
import {NavBar} from "../../navbar";
import {Footer} from "../../footer";
import "../legal-style.css";

export const generateMetadata = (): Metadata => {
  return {
    title: `Privacy Policy`,
    description: "",
    icons: {
      icon: "image/favicon.ico",
      shortcut: "image/favicon-16x16.png",
      apple: "image/apple-touch-icon.png",
    },
  };
};

const privacyPolicyMarkdown = `
# **Privacy Policy**

**Effective Date:** January 30th, 2025

**Ripple Media** respects your privacy and is committed to protecting it through this Privacy Policy. This policy explains how we collect, use, disclose, and safeguard your information when you visit our website, [https://www.ripple-media.co/](https://www.ripple-media.co/) (the "Website").

By using our Website, you agree to the collection and use of information in accordance with this Privacy Policy.

---

### **1. Information We Collect**
We collect various types of information to better serve our clients and qualify leads, including:

**a. Personal Information:**
- Name
- Email address
- Phone number
- Business name
- Other business-related details provided by you

**b. Automatically Collected Information:**
- IP address
- Browser type and version
- Pages visited and time spent on the Website
- Device information
- Cookies and tracking technologies

---

### **2. How We Use Your Information**
We use the information collected to:
- Respond to inquiries and connect with potential clients
- Qualify leads and determine business opportunities
- Improve our Website and user experience
- Send marketing and promotional materials (with opt-out options)
- Comply with legal obligations

---

### **3. How We Share Your Information**
We do not sell or rent your personal information. However, we may share your information with:
- **Service Providers:** Third-party vendors who help us operate and maintain the Website.
- **Legal Compliance:** If required by law or to protect our rights and users.
- **Business Transfers:** In the event of a merger, sale, or acquisition.

---

### **4. Cookies and Tracking Technologies**
We use cookies and similar technologies to enhance user experience and collect analytical data. You can manage cookie preferences through your browser settings.

---

### **5. Data Security**
We implement security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no data transmission over the internet is 100% secure, and we cannot guarantee absolute security.

---

### **6. Your Rights and Choices**
You have the right to:
- Request access to the personal information we hold about you
- Request correction or deletion of your personal data
- Opt out of marketing communications
- Restrict or object to data processing in certain circumstances

To exercise these rights, please contact us at [Insert Contact Email].

---

### **7. Third-Party Links**
Our Website may contain links to third-party sites. We are not responsible for their privacy practices and encourage you to review their policies.

---

### **8. Changes to This Privacy Policy**
We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.

---

### **9. Contact Us**
If you have any questions about this Privacy Policy, please contact us at:

**Ripple Media**  
Website: [https://www.ripple-media.co/](https://www.ripple-media.co/)  
Email: team@ripple-media.co
`;

const PrivacyPolicy = () => {
  return (
    <div className="dark flex flex-col h-fit min-h-screen">
      <NavBar />
      <div className="legal">
        <ReactMarkdown>{privacyPolicyMarkdown}</ReactMarkdown>
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default PrivacyPolicy;
