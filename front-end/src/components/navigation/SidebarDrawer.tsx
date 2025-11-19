import { Icon } from "@iconify/react"
import UserDropdown from "../inputs/UserDrodown"
import Scrollbar from "../display/ScrollBar"
import ChatDropdown from "../inputs/ChatDropdown"
import type { Conversa, } from '../../types/chat'



interface SidebarDrawerProps {
  conversasList: Conversa[]
  onNovoChat: () => void
  onSelecionarConversas?: (index: number) => void
  conversaAtual?: number
  onExcluirConversas?: (index: number) => void


}

export default function SidebarDrawer({
  conversasList,
  onNovoChat,
  onSelecionarConversas,
  conversaAtual,
  onExcluirConversas,
}: SidebarDrawerProps) {


  return (
    <div className="w-80 h-[98vh] my-auto bg-gray-900 border border-gray-700 flex flex-col shadow-xl rounded-2xl mx-2">
      {/* Header moderno com bordas arredondadas no topo */}
      <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800 rounded-t-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-green-800 flex items-center justify-center shadow-lg">
            <Icon icon="lucide:bot" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              Kimera
            </h2>
            <p className="text-xs text-gray-400 font-medium">O demonio da sua ia </p>
          </div>
        </div>
      </div>

      {/* Botão Novo Chat destacado */}
      <div className="p-4">
        <button
          className="flex items-center gap-3 w-full p-4 rounded-xl text-left transition-all duration-200 
                     bg-gradient-to-r from-blue-700 to-green-800 hover:from-blue-500 hover:to-green-500 
                     text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] 
                     border border-blue-400/20 group"
          onClick={onNovoChat}
        >
          <div className="p-1.5 rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors">
            <Icon icon="lucide:plus" className="w-4 h-4" />
          </div>
          <span className="font-semibold">Novo Chat</span>
        </button>
      </div>

      {/* Lista de Conversas com scroll personalizado */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header fixo */}
        <div className="flex items-center justify-between px-2 py-3 bg-gray-900 border-b border-gray-700/50 sticky top-0 z-10">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Conversas</h3>
          <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full min-w-[20px] text-center">
            {conversasList.length}
          </span>
        </div>

        {/* Área de scroll usando o componente */}
        <Scrollbar className="p-2">
          <div className="space-y-1">
            {conversasList.map((conversas, index) => (
              <button
                key={index}
                onClick={() => onSelecionarConversas?.(index)}
                className={`h-15 flex items-center gap-3 w-full p-4 rounded-xl text-left transition-all duration-200 group relative
                     ${conversaAtual === index
                    ? "h-14 bg-blue-500/20 border border-blue-500/30 text-white shadow-lg shadow-black-500/10"
                    : "h-14 text-gray-300 hover:bg-gray-800/80 hover:text-white border border-transparent hover:border-gray-600/50"
                  }`}
              >
                {/* Indicador de conversa ativa */}
                {conversaAtual === index && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full" />
                )}

                <div
                  className={`p-2 rounded-xl transition-all duration-200 ${conversaAtual === index
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-gray-700 group-hover:bg-gray-600 text-gray-400 group-hover:text-white"
                    }`}
                >
                  <Icon icon="lucide:message-circle" className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium truncate block text-white">{conversas.mensagens[0]?.texto || conversas.titulo}</span>
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
                  <ChatDropdown onExcluir={onExcluirConversas} conversaIndex={index}>
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

      {/* Footer com bordas arredondadas na base */}
      <div className="p-4 border-t border-gray-700 bg-gray-800/50 rounded-b-2xl">
        {/* User profile */}


        <UserDropdown>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/80 border border-gray-700">
            <div className="flex items-center justify-center">
              <img
                src="https://wallpapers-clan.com/wp-content/uploads/2023/02/wizard-art-wallpaper.jpg"
                alt="Navegador"
                className="w-8 h-8 rounded-full object-cover bg-gradient-to-br from-green-500 to-blue-500"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Baiano</p>
              <p className="text-xs text-gray-400 truncate">Jesus existe</p>
            </div>
            <Icon icon="lucide:chevron-down" className="w-4 h-4 text-gray-400" />
          </div>
        </UserDropdown>
      </div>
    </div>
  )
}
