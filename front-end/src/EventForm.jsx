// EventForm.jsx
import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  CardContent,
  Card,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import api from "./axiosInstance";
import TabbedEventMenu from "./TabbedEventMenu";
import { getUserId } from "./context/AuthContext";

// Inside your EventForm component

const EventForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = getUserId();
  const [formData, setFormData] = useState(
    id || {
      nome: "",
      nomeDoOrganizador: "",
      telefoneDoOrganizador: "",
      pixDoEvento: "",
      enderecoParaEntrega: "",
      dataLimiteParaEntrega: "",
      quantidadeGruposParticipantes: 1,
      userId,
    }
  );

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await api.get(`/api/eventos/${id}`, userId);
        setFormData(response.data); // Assuming the response data is the event object
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    if (id) {
      fetchEventData();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    id ? handleEditEvento(formData) : handleAddEvento(formData);
  };

  const handleAddEvento = async (evento) => {
    try {
      await api.post("/api/eventos", evento).then((response) => {
        console.log(response);
        navigate("/evento/" + response._id);
      });
    } catch (error) {
      console.error("Error adding evento:", error);
    }
  };

  const handleEditEvento = async (evento) => {
    try {
      await api.put(`/api/eventos/${evento._id}`, evento).then((response) => {
        console.log(response);
      });
      alert("Evento atualizado com sucesso");
    } catch (error) {
      console.error("Error editing evento:", error);
    }
  };

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          margin: "16px 16px", // Add margin to the top and bottom
        }}
      >
        <Typography variant="h5">
          {id ? "Editar Evento" : "Novo Evento"}
        </Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <Card>
              <CardContent>
                <Typography
                  sx={{ fontSize: 16 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Informações do Evento
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="nome"
                      label="Nome"
                      value={formData.nome}
                      onChange={handleChange}
                      InputLabelProps={{
                        shrink: Boolean(formData.nome),
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="pixDoEvento"
                      label="PIX"
                      value={formData.pixDoEvento}
                      onChange={handleChange}
                      InputLabelProps={{
                        shrink: Boolean(formData.pixDoEvento),
                      }}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={12}>
            <Card>
              <CardContent>
                <Typography
                  sx={{ fontSize: 16 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Informações do Organizador
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="nomeDoOrganizador"
                      label="Nome"
                      value={formData.nomeDoOrganizador}
                      onChange={handleChange}
                      InputLabelProps={{
                        shrink: Boolean(formData.nomeDoOrganizador),
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="telefoneDoOrganizador"
                      label="Telefone"
                      value={formData.telefoneDoOrganizador}
                      onChange={handleChange}
                      InputLabelProps={{
                        shrink: Boolean(formData.telefoneDoOrganizador),
                      }}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Card>
              <CardContent>
                <Typography
                  sx={{ fontSize: 16 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Informações da Entrega de Doações
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="enderecoParaEntrega"
                      label="Endereço"
                      value={formData.enderecoParaEntrega}
                      onChange={handleChange}
                      InputLabelProps={{
                        shrink: Boolean(formData.enderecoParaEntrega),
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="dataLimiteParaEntrega"
                      label="Data Limite"
                      type="date"
                      value={
                        formData.dataLimiteParaEntrega
                          ? new Date(formData.dataLimiteParaEntrega)
                              .toISOString()
                              .split("T")[0]
                          : null
                      }
                      onChange={handleChange}
                      InputLabelProps={{
                        shrink: Boolean(
                          formData.nome || formData.dataLimiteParaEntrega
                        ),
                      }}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Card>
              <CardContent>
                <Typography
                  sx={{ fontSize: 16 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Informações de Grupos Participantes
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="quantidadeGruposParticipantes"
                      label="Quantidade de Grupos Participantes"
                      type="number"
                      value={formData.quantidadeGruposParticipantes || ""}
                      onChange={handleChange}
                      InputLabelProps={{
                        shrink: Boolean(formData.quantidadeGruposParticipantes),
                      }}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                {id ? "Atualizar Evento" : "Adicionar Evento"}
              </Button>
            </Grid>{" "}
          </Grid>
        </Grid>
      </form>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          {id ? <TabbedEventMenu id={id} /> : <></>}
        </Grid>
      </Grid>
    </>
  );
};

export default EventForm;
