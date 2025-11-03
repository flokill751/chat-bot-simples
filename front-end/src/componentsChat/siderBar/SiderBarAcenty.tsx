"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../../components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import Scrollbar from "../scrollBar/ScrollBar";
import ChatDropdown from "../inputs/ChatDropdown";
import { Icon } from "@iconify/react"



interface SideBarPros {
  conversasList: string[]
  onNovoChat: () => void
  onSelecionarConversa?: (index: number) => void
  conversaAtual?: number
  onExcluirConversa?: (index: number) => void
}


export function SidebarAcenty({
  conversasList,
  onNovoChat,
  onSelecionarConversa,
  conversaAtual,
  onExcluirConversa,
  }: SideBarPros) {
  
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="h-5 w-5 shri text-neutral-200" />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 dark:text-neutral-200" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    // <div
    //   className={cn(
    //     "mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
    //     "h-[60vh]", // for your use case, use `h-screen` instead of `h-[60vh]`
    //   )}
    // >
      <div >
      
      <Sidebar open={open} setOpen={setOpen}>
  <SidebarBody className="justify-between gap-10">
    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
      {open ? <Logo /> : <LogoIcon />}
      <div className="mt-8 flex flex-col gap-2">
        {links.map((link, idx) => (
          <SidebarLink key={idx} link={link} />
        ))}
      </div>
    </div>
    
    <div className="flex-1 flex flex-col min-h-0"> {/* Esta div deve controlar o height */}
      
      {/* Header fixo */}
      <div className="flex items-center justify-between px-2 py-3 bg-gray-900 border-b border-gray-700/50 sticky top-0 z-10">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Conversas</h3>
        <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full min-w-[20px] text-center">
          {conversasList.length}
        </span>
      </div>

      {/* Área de scroll */}
      <div className="flex-1 min-h-0"> 
        <Scrollbar className="h-full p-2">
          <div className="space-y-1">
            {conversasList.map((conversa, index) => (
              <button
                key={index}
                onClick={() => onSelecionarConversa?.(index)}
                className={`flex items-center gap-3 w-full p-3 rounded-xl text-left transition-all duration-200 group relative
                  ${
                    conversaAtual === index
                      ? "bg-blue-500/20 border border-blue-500/30 text-white shadow-lg shadow-blue-500/10"
                      : "text-gray-300 hover:bg-gray-800/80 hover:text-white border border-transparent hover:border-gray-600/50"
                  }`}
              >
                {/* Indicador de conversa ativa */}
                {conversaAtual === index && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full" />
                )}

                <div
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    conversaAtual === index
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-gray-700 group-hover:bg-gray-600 text-gray-400 group-hover:text-white"
                  }`}
                >
                  <Icon icon="lucide:message-circle" className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium truncate block text-white">{conversa}</span>
                  <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Icon icon="lucide:clock" className="w-3 h-3" />
                    Criado agora
                  </span>
                </div>

                {/* Menu de opções */}
                <div
                  className="opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ChatDropdown onExcluir={onExcluirConversa} conversaIndex={index}>
                    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-700/50 transition-colors">
                      <Icon icon="lucide:more-horizontal" className="w-4 h-4 text-gray-400" />
                    </div>
                  </ChatDropdown>
                </div>
              </button>
            ))}

            {/* Estado vazio melhorado */}
            {conversasList.length === 0 && (
              <div className="text-center py-8 px-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-800/50 border border-gray-700 flex items-center justify-center">
                  <Icon icon="lucide:message-square" className="w-6 h-6 text-gray-500" />
                </div>
                <p className="text-gray-400 text-sm font-medium">No conversations yet</p>
                <p className="text-gray-500 text-xs mt-1">Start a new chat to begin your journey</p>
              </div>
            )}
          </div>
        </Scrollbar>
      </div>
    </div>
  </SidebarBody>
</Sidebar>

    </div>

  );
}
export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-yellow-300 "
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-yellow-300" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre dark:text-amber-300"
      >
       Kimera AI
      </motion.span>
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white  "
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm dark:bg-white" />
    </a>
  );
};

// Componente a Parte 
// const Dashboard = () => {
//   return (
//     <div className="flex flex-1">
//       <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
//         <div className="flex gap-2">
//           {[...new Array(4)].map((i, idx) => (
//             <div
//               key={"first-array-demo-1" + idx}
//               className="h-20 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"
//             ></div>
//           ))}
//         </div>
//         <div className="flex flex-1 gap-2">
//           {[...new Array(2)].map((i, idx) => (
//             <div
//               key={"second-array-demo-1" + idx}
//               className="h-full w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"
//             ></div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };
