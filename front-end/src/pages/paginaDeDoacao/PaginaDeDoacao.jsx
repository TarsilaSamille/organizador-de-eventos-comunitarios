import {
  Box,
  CardContent,
  Card,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../context/axiosInstance";

const PaginaDeDoacao = () => {
  const { eventoId, grupoId } = useParams();
  const [itens, setItens] = useState([]);
  const [novaDoacao, setNovaDoacao] = useState({
    nomeDoDoador: "",
    telefone: "",
    pixOuEntrega: "pix",
  });
  const [doacaoInfo, setDoacaoInfo] = useState({
    selectedItems: [],
    valorTotal: 0,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNovaDoacao({ ...novaDoacao, [name]: value });
  };

  useEffect(() => {
    const fetchItens = async () => {
      try {
        let url = `/api/listaDeAjuda/${eventoId}`;
        if (grupoId) url += `/${grupoId}`;
        const response = await api.get(url);
        setItens(response.data);
      } catch (error) {
        console.error("Error fetching Lista de Ajuda:", error);
      }
    };
    fetchItens();
  }, [eventoId, grupoId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const itemsToUpdate = doacaoInfo.selectedItems.map((itemId) => ({
        itemId,
        ...novaDoacao,
      }));

      await api.post("/api/itens/atualizar", itemsToUpdate);
      alert("Itens atualizados com sucesso");
    } catch (error) {
      console.error("Error updating items:", error);
      alert("Erro ao atualizar itens");
    }
  };

  const columns = [
    { field: "item", headerName: "Item", width: 150 },
    {
      field: "preco",
      headerName: "Preço",
      width: 110,
      valueFormatter: (preco) => `R$ ${preco}`,
    },
    {
      field: "grupo",
      headerName: "Grupo",
      width: 110,
    },
  ];

  const rows = itens.map((item) => ({
    id: item._id,
    item: item.item,
    preco: item.preco.toFixed(2),
    grupo: item.grupoId.nome,
    cor: item.grupoId.cor,
  }));
  const [selectedRows, setSelectedRows] = React.useState([]);

  function generateCSSRules(rows) {
    let cssRules = "";

    rows.forEach((row) => {
      const color = row.cor.replace("#", "");
      cssRules += `.row-color-${color} { background-color: ${row.cor}!important; }\n`;
    });

    return cssRules;
  }

  const cssRules = generateCSSRules(rows);

  const styleElement = document.createElement("style");
  styleElement.textContent = cssRules;
  document.head.appendChild(styleElement);

  return (
    <Box sx={{ padding: 2, margin: "auto" }}>
      <Grid container spacing={2} sx={{ padding: 3 }}>
        <Grid xs={6}>
          <Typography variant="h4" gutterBottom>
            Página de Doação
          </Typography>
        </Grid>
      </Grid>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography
                  sx={{ fontSize: 16 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Informações Pessoais
                </Typography>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Nome"
                        value={novaDoacao.nomeDoDoador}
                        name="nomeDoDoador"
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ marginBottom: 1 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Telefone"
                        value={novaDoacao.telefone}
                        name="telefone"
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ marginBottom: 1 }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <FormControl>
                    <Typography
                      sx={{ fontSize: 16 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      Modo de Doacao
                    </Typography>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      value={novaDoacao.pixOuEntrega}
                      name="pixOuEntrega"
                      onChange={handleInputChange}
                    >
                      <FormControlLabel
                        value="pix"
                        control={<Radio />}
                        label="Pix"
                      />
                      <FormControlLabel
                        value="entrega"
                        control={<Radio />}
                        label="Entrega"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Grid item xs={12} ls={6}>
                  <Typography
                    sx={{ fontSize: 16 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    Items
                  </Typography>
                  <DataGrid
                    autoHeight
                    density="compact"
                    rows={rows}
                    columns={columns}
                    initialState={{
                      pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                      },
                    }}
                    getRowClassName={(params) =>
                      `row-color-${params.row.cor.replace("#", "")}`
                    }
                    pageSizeOptions={[10, 20]}
                    checkboxSelection
                    onRowSelectionModelChange={(ids) => {
                      setSelectedRows(ids);
                      const selectedItemsData = rows.filter((row) =>
                        ids.includes(row.id)
                      );
                      setDoacaoInfo({
                        ...doacaoInfo,
                        selectedItems: selectedItemsData.map((item) => item.id),
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Grid item xs={12}>
                      <Typography variant="body1" gutterBottom>
                        Total de itens selecionados:{" "}
                        {doacaoInfo.selectedItems.length}
                      </Typography>{" "}
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="body1" gutterBottom>
                        Total de preços selecionados: R${" "}
                        {selectedRows
                          .reduce(
                            (acc, id) =>
                              acc +
                              parseFloat(
                                rows.find((row) => row.id === id).preco
                              ),
                            0
                          )
                          .toFixed(2)}{" "}
                      </Typography>{" "}
                    </Grid>
                  </Box>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Button
                style={{
                  minWidth: "60vw",
                }}
                type="submit"
                variant="contained"
                color="primary"
              >
                Assinar Nome na Lista
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default PaginaDeDoacao;
