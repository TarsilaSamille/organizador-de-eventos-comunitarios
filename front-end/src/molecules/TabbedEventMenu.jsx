import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grupos from "../organisms/Grupos"; // Ajuste o caminho conforme necessário
import TabelaDeItens from "../organisms/TabelaDeItens"; // Adjust the import path as necessary
import ListaDeAjuda from "../organisms/ListaDeAjuda"; // Adjust the import path as necessary

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function TabbedEventMenu({ id }) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Tabela De Itens" {...a11yProps(0)} />
          <Tab label="Grupos" {...a11yProps(1)} />
          <Tab label="Lista De Ajuda" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <TabelaDeItens eventoId={id} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Grupos eventoId={id} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <ListaDeAjuda eventoId={id} />
      </CustomTabPanel>
    </Box>
  );
}
