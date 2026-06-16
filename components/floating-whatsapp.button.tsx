/* eslint-disable @next/next/no-img-element */

import siteConfig from "@/config";
import Image from "next/image";
import { useLeadDialog } from "./lead-dialog-provider";

const FloatingWhatsAppButton = () => {
  const withLeadDialog = useLeadDialog();
  if (!siteConfig.whatsapp || !siteConfig.whatsapp[0]) return null;

  const whatsapp = siteConfig.whatsapp[0];

  return (
    <div id="floating-whatsapp-button">
      <Image
        width={200}
        height={73}
        onClick={() => withLeadDialog.openWhatsApp(whatsapp.number)}
        src="/actions/whatsapp-button.webp"
        alt="Whatsapp"
      />
    </div>
  );
};

export default FloatingWhatsAppButton;
