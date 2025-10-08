"use client"

import type React from "react"

import { useState } from "react"
import { createPortal } from "react-dom"
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react"
import { Icon } from "@iconify/react"

interface ChatDropdownProps {
  children?: React.ReactNode
  onExcluir?: (index: number) => void
  conversaIndex?: number
}

export default function ChatDropdown({ children, onExcluir, conversaIndex }: ChatDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showConfirmacao, setShowConfirmacao] = useState(false)
  const [acao, setAcao] = useState<"excluir" | null>(null)
  const [estaConversa, setEstaConversa] = useState<number | null>(null)

  const abrirModal = (tipo: "excluir") => {
    setIsOpen(false)
    setTimeout(() => {
      setAcao(tipo)
      setShowConfirmacao(true)
      setEstaConversa(conversaIndex ?? null)
    }, 50)
  }

  const cancelarExclusao = () => {
    setShowConfirmacao(false)
  }

  const confirmarExclusao = () => {
    if (acao === "excluir" && onExcluir && estaConversa !== null) {
      onExcluir(estaConversa)
    }
    setShowConfirmacao(false)
    setAcao(null)
    setEstaConversa(null)
  }

  return (
    <>
      <Dropdown
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        placement="top-start"
        trigger="press"
        classNames={{
          content: "bg-gray-800 border border-gray-700 rounded-xl shadow-xl",
        }}
      >
        <DropdownTrigger>
          <div className="cursor-pointer">{children}</div>
        </DropdownTrigger>

        <DropdownMenu
          aria-label="User menu"
          variant="flat"
          className="p-2"
          onAction={(key) => {
            if (key === "delete") abrirModal("excluir")
          }}
          itemClasses={{
            base: "px-3 py-2 rounded-lg data-[hover=true]:bg-gray-700/50 transition-all duration-200",
            title: "text-sm text-white",
            description: "text-xs text-gray-400",
            shortcut: "text-xs text-gray-500",
          }}
        >
          <DropdownItem
            key="delete"
            startContent={<Icon icon="lucide:trash-2" className="w-4 h-4 text-red-400 mr-2" />}
            description="Excluir conversa"
          >
            Excluir esta conversa
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {showConfirmacao &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 max-w-sm mx-4">
              <h3 className="flex items-center justify-center text-lg font-semibold text-white mb-2">
                Confirmar Exclusão
              </h3>
              <p className="text-gray-300 mb-4">Tem certeza que deseja excluir esta conversa?</p>
              <div className="flex gap-3">
                <button
                  onClick={cancelarExclusao}
                  className="flex-1 p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarExclusao}
                  className="flex-1 p-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
