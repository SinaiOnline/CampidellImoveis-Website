import siteConfig from "@/config";
import { Email, Instagram, Phone, WhatsApp } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useLeadDialog } from "./lead-dialog-provider";

const FloatingSideMenu = () => {
  const withLeadDialog = useLeadDialog();

  interface MenuItem {
    disabled?: boolean;
    name: string;
    CTA: string;
    iconComponent: React.ReactNode;
    func?: () => void;
  }

  const items: MenuItem[] = [
    {
      disabled: siteConfig.whatsapp?.[0].number ? false : true,
      name: "WhatsApp " + siteConfig.whatsapp?.[0].label,
      CTA: `WhatsApp${siteConfig.whatsapp?.[0].label ? `: ${siteConfig.whatsapp?.[0].label}` : ""}`,
      iconComponent: <WhatsApp />,
      func: () =>
        siteConfig.whatsapp?.[0].number &&
        withLeadDialog.openWhatsApp(siteConfig.whatsapp?.[0].number),
    },
    {
      disabled: siteConfig.phoneNumbers?.[0].number ? false : true,
      name: "Telefone",
      CTA: `Ligue: ${siteConfig.phoneNumbers[0]?.number}`,
      iconComponent: <Phone />,
      func: () => withLeadDialog.openPhone(siteConfig.phoneNumbers[0].number),
    },
    {
      disabled: siteConfig.emails ? false : true,
      name: "Email",
      CTA: `Envie um email: ${siteConfig.emails[0]?.address}`,
      iconComponent: <Email />,
      func: () => withLeadDialog.openEmail(siteConfig.emails[0].address),
    },
    {
      disabled: siteConfig.instagram ? false : true,
      name: "Instagram",
      CTA: "Acesse nosso Instagram",
      iconComponent: <Instagram />,
      func: () =>
        window.open(
          "https://www.instagram.com/" + siteConfig.instagram?.replace("@", ""),
          "_blank",
        ),
    },
  ];

  async function handleClick(item: MenuItem) {
    item.func?.();
  }

  return (
    <div id="floating-side-menu">
      {items
        .filter((item) => !item.disabled)
        .map((item, index) => (
          <div className="menu-item" key={index}>
            <Tooltip
              title={
                <p className="tooltip-content">
                  <strong>{item.CTA}</strong>
                </p>
              }
              arrow
              placement="left"
            >
              <IconButton
                aria-label={item.name}
                key={index}
                onClick={() => handleClick(item)}
                color="secondary"
                sx={{ padding: "16px" }}
              >
                {item.iconComponent}
              </IconButton>
            </Tooltip>
          </div>
        ))}
    </div>
  );
};

export default FloatingSideMenu;
