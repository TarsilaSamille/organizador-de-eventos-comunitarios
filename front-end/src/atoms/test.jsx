const EventItem = ({ title, icon }) => (
  <div className="flex gap-5 justify-center px-4 py-5 mt-4 text-base font-medium leading-6 bg-red-100 rounded-lg text-purple-950">
    <div className="flex-auto">{title}</div>
    <img src={icon} alt="" className="shrink-0 self-start w-4 aspect-square" />
  </div>
);

// const ParticipantItem = ({ name, contribution, avatar, position }) => (
//   <div className="flex gap-5 justify-between items-start">
//     <div className="flex flex-col">
//       <div className="text-base leading-6 text-purple-950">{name}</div>
//       <div className="mt-3 text-sm font-light leading-5 text-purple-950">
//         {contribution}
//       </div>
//     </div>
//     <img
//       src="https://cdn.builder.io/api/v1/image/assets/TEMP/63c29b15d822bb38aff1fe934eab877f2c951a6d192c5562ed6cb5f98f62b020?apiKey=935ac0b7ca3849a3b421b755fb2404f5&"
//       alt=""
//       className="shrink-0 w-8 aspect-[0.8]"
//     />
//     <div className="self-stretch my-auto text-base font-bold leading-6 text-purple-950">
//       {position}
//     </div>
//     <img
//       src="https://cdn.builder.io/api/v1/image/assets/TEMP/b0e93e1e2bf88770227a2338fd4f4a4012120374b803e008e3a57445eaca460b?apiKey=935ac0b7ca3849a3b421b755fb2404f5&"
//       alt=""
//       className="shrink-0 w-8 aspect-[0.8]"
//     />
//   </div>
// );

// const NavItem = ({ icon, label, active }) => (
//   <div
//     className={`flex flex-col self-start ${
//       active ? "text-purple-950" : "text-purple-950"
//     }`}
//   >
//     <img src={icon} alt="" className="self-center w-5 aspect-[0.63]" />
//     <div className="mt-2">{label}</div>
//   </div>
// );

const donations = [
  { title: "Fundos para o Hospital", progress: 75, goal: "R$10.000" },
  { title: "Roupas para o Inverno", progress: 50, goal: "500 peças" },
];

// const participants = [
//   {
//     name: "João Silva",
//     contribution: "Contribuiu: R$300",
//     avatar:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/8c1f70cd0dc0107ed4fabb9eecf904d8deb3bc33fbdb53e53b671aee0d4c779b?apiKey=935ac0b7ca3849a3b421b755fb2404f5&",
//     position: 1,
//   },
//   {
//     name: "Maria Souza",
//     contribution: "Doou 15 peças de roupa",
//     avatar:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/8c1f70cd0dc0107ed4fabb9eecf904d8deb3bc33fbdb53e53b671aee0d4c779b?apiKey=935ac0b7ca3849a3b421b755fb2404f5&",
//     position: 2,
//   },
// ];

//   const navItems = [
//     {
//       icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/85e0e9fdb7fc06e87d57615912de469c956472ac883c3681dff27ab97b61ec18?apiKey=935ac0b7ca3849a3b421b755fb2404f5&",
//       label: "Dashboard",
//       active: false,
//     },
//     {
//       icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/318f6823062a3e3baa464dbbdfe2c436863d87fdf28a14d9da3e4537b9d026a2?apiKey=935ac0b7ca3849a3b421b755fb2404f5&",
//       label: "Eventos",
//       active: true,
//     },
//     {
//       icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/6589a3641f4b9e59cbc250f185c005fa75c3caa92824215301bc4879de0e30f7?apiKey=935ac0b7ca3849a3b421b755fb2404f5&",
//       label: "Doações",
//       active: false,
//     },
//     {
//       icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/a88e377da2a973329310fcb63cd1795355b3410786e000a42b429eb693ed6973?apiKey=935ac0b7ca3849a3b421b755fb2404f5&",
//       label: "Configurações",
//       active: false,
//     },
//   ];
