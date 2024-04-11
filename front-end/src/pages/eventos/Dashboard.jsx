import React, { useState, useEffect } from "react";
import EventTable from "./EventTable";
import { DonationProgress } from "../../atoms/DonationProgress";
import api from "../../context/axiosInstance";

export const Dashboard = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await api.get("/api/eventos/progress");
        setDonations(response.data);
      } catch (error) {
        console.error("Error fetching eventos:", error);
      }
    };

    fetchEventos();
  }, []);
  return (
    <div className="flex flex-col justify-center pt-3 mx-auto w-full bg-white rounded-lg">
      <header className="flex flex-col self-center w-full text-4xl font-bold tracking-tighter leading-10 text-center text-purple-950 mb-8">
        <h1 className="mt-5">Dashboard do Organizador</h1>
      </header>
      <main className="flex flex-col px-8 mt-8 w-full space-y-12">
        <section className="flex flex-col space-y-8">
          <h2 className="text-2xl font-bold tracking-tight text-purple-950">
            Seus Eventos
          </h2>
          <EventTable />
        </section>
        <section className="flex flex-col space-y-8">
          {/* Adjust layout */}
          <h2 className="text-2xl font-bold tracking-tight text-purple-950">
            Progresso das Doações
          </h2>
          {donations.map((donation, index) => (
            <DonationProgress
              key={index}
              title={donation.title}
              progress={donation.progress}
              goal={donation.goal}
            />
          ))}
        </section>
        {/* <section className="flex flex-col space-y-8">
          <h2 className="mt-9 text-lg font-bold tracking-tight text-purple-950">
            Próximas Ações
          </h2>
          <div className="flex gap-4 items-center mt-6">
            <div className="flex flex-col self-stretch">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/5c4787f184d031b9a02080f3d52756d5283dfb56d52c12e7851d66eaaeb39b85?apiKey=935ac0b7ca3849a3b421b755fb2404f5&"
                alt=""
                className="self-center w-12 aspect-square"
              />
              <div className="flex gap-0.5 justify-center items-start px-5 mt-6 w-12 h-12 bg-red-100 rounded-md">
                <div className="shrink-0 border-2 border-solid border-purple-950 h-[15px] w-[5px]" />
                <div className="shrink-0 border-2 border-solid border-purple-950 h-[15px] w-[5px]" />
              </div>
            </div>
            <div className="flex flex-col self-stretch my-auto text-base leading-6 text-purple-950">
              <div>Editar Evento</div>
              <div className="mt-3 text-sm font-light leading-5 text-purple-950">
                Modificar detalhes do evento
              </div>
              <div className="mt-10">Cancelar Evento</div>
              <div className="mt-3 text-sm font-light leading-5 text-purple-950">
                Cancelar evento planejado
              </div>
            </div>
            <div className="flex flex-col self-stretch my-auto text-sm font-medium leading-5 text-center whitespace-nowrap text-purple-950">
              <button className="justify-center px-3.5 py-3.5 bg-red-100 rounded-md">
                Editar
              </button>
              <button className="justify-center p-3.5 mt-9 bg-red-100 rounded-md">
                Cancelar
              </button>
            </div>
          </div>
        </section> */}
        {/* <section className="flex flex-col space-y-8">
   
          <h2 className="mt-9 text-lg font-bold tracking-tight text-purple-950">
            Participantes Ativos
          </h2>
          <div className="flex gap-4 mt-6">
            <div className="flex flex-col items-center">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/8c1f70cd0dc0107ed4fabb9eecf904d8deb3bc33fbdb53e53b671aee0d4c779b?apiKey=935ac0b7ca3849a3b421b755fb2404f5&"
                alt=""
                className="w-12 aspect-square"
              />
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/8c1f70cd0dc0107ed4fabb9eecf904d8deb3bc33fbdb53e53b671aee0d4c779b?apiKey=935ac0b7ca3849a3b421b755fb2404f5&"
                alt=""
                className="mt-6 w-12 aspect-square"
              />
            </div>
            <div className="flex flex-col grow shrink-0 my-auto basis-0 w-fit">
              <div className="flex gap-5 w-full">
                <div className="flex flex-col flex-1 my-auto">
                  <div className="text-base leading-6 text-purple-950">
                    João Silva
                  </div>
                  <div className="mt-2.5 text-sm font-light leading-5 text-purple-950">
                    Contribuiu: R$300
                  </div>
                </div>
                <div className="flex flex-1 gap-5 justify-between text-base font-bold leading-6 whitespace-nowrap text-purple-950">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/63c29b15d822bb38aff1fe934eab877f2c951a6d192c5562ed6cb5f98f62b020?apiKey=935ac0b7ca3849a3b421b755fb2404f5&"
                    alt=""
                    className="shrink-0 w-8 aspect-[0.8]"
                  />
                  <div className="my-auto">1</div>
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/b0e93e1e2bf88770227a2338fd4f4a4012120374b803e008e3a57445eaca460b?apiKey=935ac0b7ca3849a3b421b755fb2404f5&"
                    alt=""
                    className="shrink-0 w-8 aspect-[0.8]"
                  />
                </div>
              </div>
              {participants.map((participant, index) => (
                <ParticipantItem
                  key={index}
                  name={participant.name}
                  contribution={participant.contribution}
                  avatar={participant.avatar}
                  position={participant.position}
                />
              ))}
            </div>
          </div>
        </section> */}
      </main>
      {/* <nav className="flex gap-5 justify-center px-8 py-3 mt-8 text-base font-medium leading-6 text-center whitespace-nowrap bg-white border-t border-solid border-t-red-100 text-purple-950">
        {navItems.map((item, index) => (
          <NavItem
            key={index}
            icon={item.icon}
            label={item.label}
            active={item.active}
          />
        ))}
      </nav> */}
    </div>
  );
};
