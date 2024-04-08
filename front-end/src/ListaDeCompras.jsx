import React, { useState } from "react";

const ListaDeCompras = () => {
  // Dados dos itens
  const itens = [
    { descricao: "Tampa e base", quantidade: 2, precoUnitario: 24.39 },
    { descricao: "Tampa e base", quantidade: 2, precoUnitario: 23.93 },
    { descricao: "Feijão Preto", quantidade: 8, precoUnitario: 9.15 },
    { descricao: "Parboilizado 5 kg", quantidade: 2, precoUnitario: 28.45 },
    { descricao: "Farinha de Mandioca", quantidade: 7, precoUnitario: 4.39 },
    { descricao: "Óleo", quantidade: 2, precoUnitario: 5.49 },
    { descricao: "Margarina", quantidade: 1, precoUnitario: 10.68 },
    // Adicione os demais itens aqui
  ];

  // Estado para controlar a lista de compras
  const [listaDeCompras, setListaDeCompras] = useState([]);

  // Função para adicionar um item à lista de compras
  const adicionarItem = (item) => {
    setListaDeCompras([...listaDeCompras, item]);
  };

  // Função para renderizar a tabela de itens
  const renderizarTabela = () => (
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Preço</th>
          <th>Nome do irmão</th>
          <th>Pix ou entrega</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {listaDeCompras.map((item, index) => (
          <tr key={index}>
            <td>{item.descricao}</td>
            <td>R$ {item.precoUnitario.toFixed(2)}</td>
            <td>
              <input type="text" placeholder="Nome do irmão" />
            </td>
            <td>
              <input type="text" placeholder="Pix ou entrega" />
            </td>
            <td>
              <input type="checkbox" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div>
      <h2>Lista de Compras</h2>
      <div>
        <h3>Itens</h3>
        <ul>
          {itens.map((item, index) => (
            <li key={index}>
              {item.descricao} - R$ {item.precoUnitario.toFixed(2)}{" "}
              <button onClick={() => adicionarItem(item)}>Adicionar</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Lista de Compras</h3>
        {listaDeCompras.length > 0 ? (
          renderizarTabela()
        ) : (
          <p>Nenhum item adicionado à lista de compras ainda.</p>
        )}
      </div>
    </div>
  );
};

export default ListaDeCompras;
