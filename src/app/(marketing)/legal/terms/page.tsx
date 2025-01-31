import React from "react";
import ReactMarkdown from "react-markdown";
import {Metadata} from "next";
import Background from "@/src/app/(marketing)/components/background";
import Navbar from "@/src/app/(marketing)/components/navbar";
import Footer from "@/src/app/(marketing)/components/footer";
import "../legal-style.css";

export const generateMetadata = (): Metadata => {
  return {
    title: `Terms of Service`,
    description: "",
    icons: {
      icon: "image/favicon.ico",
      shortcut: "image/favicon-16x16.png",
      apple: "image/apple-touch-icon.png",
    },
  };
};

const termsOfServiceMarkdown = `
# **Terms of Service**

**Effective Date:** January 30th, 2025

Welcome to **Ripple Media** . These Terms of Service ("Terms") govern your use of our website, [https://www.ripple-media.co/](https://www.ripple-media.co/) (the "Website"). By accessing or using our Website, you agree to comply with and be bound by these Terms.

---

### **1. Acceptance of Terms**
By accessing or using the Website, you agree to these Terms and our Privacy Policy. If you do not agree, please do not use our Website.

---

### **2. Use of the Website**
- You must be at least 18 years old to use our Website.
- You agree to use the Website in compliance with all applicable laws and regulations.
- You agree not to engage in any prohibited activities, including but not limited to hacking, spamming, or distributing malware.

---

### **3. Intellectual Property Rights**
- All content, trademarks, and intellectual property on the Website are owned by Ripple Media.
- You may not reproduce, distribute, or modify any content from the Website without our written consent.

---

### **4. User Submissions**
- If you submit any information (such as contact details or business inquiries), you grant us a non-exclusive, royalty-free right to use it for our business purposes.
- You are responsible for ensuring that any information you provide does not violate third-party rights.

---

### **5. Disclaimers and Limitation of Liability**
- The Website is provided "as is" without warranties of any kind.
- We are not responsible for any damages resulting from your use of the Website.
- We do not guarantee that the Website will always be available or error-free.

---

### **6. Third-Party Links**
Our Website may contain links to third-party websites. We are not responsible for their content, policies, or practices.

---

### **7. Changes to These Terms**
We reserve the right to update these Terms at any time. Any changes will be posted on this page with an updated effective date.

---

### **8. Termination**
We may terminate or suspend your access to the Website at our discretion, without notice, if you violate these Terms.

---

### **9. Governing Law**
These Terms are governed by the laws of [Insert Jurisdiction]. Any disputes shall be resolved in the courts of [Insert Jurisdiction].

---

### **10. Contact Us**
If you have any questions about these Terms, please contact us at:

**Ripple Media**  
Website: [https://www.ripple-media.co/](https://www.ripple-media.co/)  
Email: team@ripple-media.co
`;

const Terms = () => {
  return (
    <div className="dark flex flex-col h-fit min-h-screen">
      <Background />
      <div className="   min-w-screen   flex flex-col  overflow-hidden">
        <Navbar show={true} isRelative={true} />
      </div>
      <div className="legal">
        <ReactMarkdown>{termsOfServiceMarkdown}</ReactMarkdown>
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Terms;
