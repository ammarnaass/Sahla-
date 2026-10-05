"use client";

import React, { useState } from "react";
import { WirelessPrintBridge } from "./WirelessPrintBridge";
import { BoundDevicesSecurity } from "./BoundDevicesSecurity";

export function SettingsTab() {
  const [pin] = useState("8842");
  const [isCounterPC, setIsCounterPC] = useState(false);
  const [autoPrint, setAutoPrint] = useState(true);
  const [testPrintStatus, setTestPrintStatus] = useState("");

  const handleTestPrint = () => {
    setTestPrintStatus(
      "جاري إرسال إشارة تجريبية إلى طابعة المحل عبر جسر الطباعة (رمز PIN: 8842)..."
    );
    setTimeout(() => {
      window.print();
      setTimeout(() => setTestPrintStatus(""), 4000);
    }, 500);
  };

  return (
    <div className="space-y-8 text-right animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white font-display">
          إعدادات الطباعة والربط اللاسلكي 🖨️
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          ربط هاتف الموظف بحاسوب الكاونتر وطابعات إبسون وكانون بدون كوابل أو برامج إضافية عبر تقنية
          SSE
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WirelessPrintBridge
          pin={pin}
          isCounterPC={isCounterPC}
          setIsCounterPC={setIsCounterPC}
          autoPrint={autoPrint}
          setAutoPrint={setAutoPrint}
          testPrintStatus={testPrintStatus}
          onTestPrint={handleTestPrint}
        />

        <BoundDevicesSecurity />
      </div>
    </div>
  );
}
