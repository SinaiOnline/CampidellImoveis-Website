import siteConfig from "@/config";
import { ExpandMore } from "@mui/icons-material";
import { Menu } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

const MenuBreadcrumb = ({ offerType }: { offerType: string}) => {
  const router = useRouter()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const push = (path: string) => {
    router.push({ pathname: router.pathname, query: { ...router.query, offerType: path } }, undefined, { shallow: true })
    setAnchorEl(null)
  }

  return (
    <div className="menu-breadcrumb">
      <div className="trigger" onClick={handleClick}>
        <p>
          {offerType == "VENDA" ? "Imóveis para Venda" : "Imóveis para Aluguel"}
        </p>
        {
          siteConfig.supportedOfferTypes === "VENDA_E_ALUGUEL" &&
          <ExpandMore style={{ height: "0.8em", transition: "all 0.3s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
        }
      </div>
      {
        siteConfig.supportedOfferTypes === "VENDA_E_ALUGUEL" &&
        <Menu
          onClose={() => setAnchorEl(null)}
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <p className="breadcrumb-menu-item" onClick={() => push("VENDA")}>Venda</p>
          <p className="breadcrumb-menu-item" onClick={() => push("ALUGUEL")}>Aluguel</p>
        </Menu>
      }
    </div>
    
  )
}

export default MenuBreadcrumb