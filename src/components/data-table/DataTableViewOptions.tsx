"use client"

import React from "react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover"
import { Column, Table } from "@tanstack/react-table"

import ReactDOM from "react-dom"
import invariant from "tiny-invariant"

import { Button } from "@/components/Button"
import { Checkbox } from "@/components/Checkbox"
import { Label } from "@/components/Label"
import { useTableSettings } from "@/hooks/admin/useTableSettings"
import { cx } from "@/lib/utils"
import { triggerPostMoveFlash } from "@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash"
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index"
import * as liveRegion from "@atlaskit/pragmatic-drag-and-drop-live-region"
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box"
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine"
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview"
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview"
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder"
import { RiDraggable, RiEqualizer2Line } from "@remixicon/react"
import { toast } from "sonner"

type CleanupFn = () => void

type ItemEntry = { itemId: string; element: HTMLElement }

type ListContextValue = {
  getListLength: () => number
  registerItem: (entry: ItemEntry) => CleanupFn
  reorderItem: (args: {
    startIndex: number
    indexOfTarget: number
    closestEdgeOfTarget: Edge | null
  }) => void
  instanceId: symbol
}

const ListContext = React.createContext<ListContextValue | null>(null)

function useListContext() {
  const listContext = React.useContext(ListContext)
  invariant(listContext !== null)
  return listContext
}

type Item = {
  id: string
  label: string
}

const itemKey = Symbol("item")

type ItemData = {
  [itemKey]: true
  item: Item
  index: number
  instanceId: symbol
}

function getItemData({
  item,
  index,
  instanceId,
}: {
  item: Item
  index: number
  instanceId: symbol
}): ItemData {
  return {
    [itemKey]: true,
    item,
    index,
    instanceId,
  }
}

function isItemData(data: Record<string | symbol, unknown>): data is ItemData {
  return data[itemKey] === true
}

type DraggableState =
  | { type: "idle" }
  | { type: "preview"; container: HTMLElement }
  | { type: "dragging" }

const idleState: DraggableState = { type: "idle" }
const draggingState: DraggableState = { type: "dragging" }

function ListItem({
  item,
  index,
  column,
}: {
  item: Item
  index: number
  column: Column<any, unknown> | undefined
}) {
  const { registerItem, instanceId } = useListContext()

  const ref = React.useRef<HTMLDivElement>(null)
  const [closestEdge, setClosestEdge] = React.useState<Edge | null>(null)

  const dragHandleRef = React.useRef<HTMLButtonElement>(null)

  const [draggableState, setDraggableState] =
    React.useState<DraggableState>(idleState)

  React.useEffect(() => {
    const element = ref.current
    const dragHandle = dragHandleRef.current
    invariant(element)
    invariant(dragHandle)

    const data = getItemData({ item, index, instanceId })

    return combine(
      registerItem({ itemId: item.id, element }),
      draggable({
        element: dragHandle,
        getInitialData: () => data,
        onGenerateDragPreview({ nativeSetDragImage }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: pointerOutsideOfPreview({
              x: "10px",
              y: "10px",
            }),
            render({ container }) {
              setDraggableState({ type: "preview", container })

              return () => setDraggableState(draggingState)
            },
          })
        },
        onDragStart() {
          setDraggableState(draggingState)
        },
        onDrop() {
          setDraggableState(idleState)
        },
      }),
      dropTargetForElements({
        element,
        canDrop({ source }) {
          return (
            isItemData(source.data) && source.data.instanceId === instanceId
          )
        },
        getData({ input }) {
          return attachClosestEdge(data, {
            element,
            input,
            allowedEdges: ["top", "bottom"],
          })
        },
        onDrag({ self, source }) {
          const isSource = source.element === element
          if (isSource) {
            setClosestEdge(null)
            return
          }

          const closestEdge = extractClosestEdge(self.data)

          const sourceIndex = source.data.index
          invariant(typeof sourceIndex === "number")

          const isItemBeforeSource = index === sourceIndex - 1
          const isItemAfterSource = index === sourceIndex + 1

          const isDropIndicatorHidden =
            (isItemBeforeSource && closestEdge === "bottom") ||
            (isItemAfterSource && closestEdge === "top")

          if (isDropIndicatorHidden) {
            setClosestEdge(null)
            return
          }

          setClosestEdge(closestEdge)
        },
        onDragLeave() {
          setClosestEdge(null)
        },
        onDrop() {
          setClosestEdge(null)
        },
      }),
    )
  }, [instanceId, item, index, registerItem])

  // Отримуємо назву колонки з header або fallback на item.label
  const columnLabel =
    column?.columnDef.header && typeof column.columnDef.header === "string"
      ? column.columnDef.header
      : item.label

  return (
    <React.Fragment>
      <div ref={ref} className="relative border-b border-transparent">
        <div
          className={cx(
            "relative flex items-center justify-between gap-2",
            draggableState.type === "dragging" && "opacity-50",
          )}
        >
          <div className="flex items-center gap-2">
            <Checkbox
              checked={column?.getIsVisible()}
              onCheckedChange={() => column?.toggleVisibility()}
            />
            <span>{columnLabel}</span>
          </div>
          <Button
            aria-hidden="true"
            tabIndex={-1}
            variant="ghost"
            className="-mr-1 px-0 py-1"
            ref={dragHandleRef}
            aria-label={`Reorder ${columnLabel}`}
          >
            <RiDraggable className="size-5 text-gray-400 dark:text-gray-600" />
          </Button>
        </div>
        {closestEdge && <DropIndicator edge={closestEdge} gap="1px" />}
      </div>
      {draggableState.type === "preview" &&
        ReactDOM.createPortal(
          <div>{columnLabel}</div>,
          draggableState.container,
        )}
    </React.Fragment>
  )
}

function getItemRegistry() {
  const registry = new Map<string, HTMLElement>()

  function register({ itemId, element }: ItemEntry) {
    registry.set(itemId, element)

    return function unregister() {
      registry.delete(itemId)
    }
  }

  function getElement(itemId: string): HTMLElement | null {
    return registry.get(itemId) ?? null
  }

  return { register, getElement }
}

type ListState = {
  items: Item[]
  lastCardMoved: {
    item: Item
    previousIndex: number
    currentIndex: number
    numberOfItems: number
  } | null
}

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const { resetSettings } = useTableSettings()

  // Отримуємо всі колонки і поточний порядок
  const allColumns = table.getAllColumns()
  const columnOrder = table.getState().columnOrder

  // Створюємо впорядковані колонки
  const orderedColumns = React.useMemo(() => {
    if (columnOrder.length === 0) {
      return allColumns
    }

    return [...allColumns].sort((a, b) => {
      const aIndex = columnOrder.indexOf(a.id)
      const bIndex = columnOrder.indexOf(b.id)
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1
      return aIndex - bIndex
    })
  }, [allColumns, columnOrder])

  // Створюємо початковий стан items
  const initialItems = React.useMemo(
    () =>
      orderedColumns.map((column) => ({
        id: column.id,
        label:
          typeof column.columnDef.header === "string"
            ? column.columnDef.header
            : column.id,
      })),
    [orderedColumns],
  )

  // Використовуємо один стан для items
  const [{ items, lastCardMoved }, setListState] = React.useState<ListState>({
    items: initialItems,
    lastCardMoved: null,
  })

  const handleReset = () => {
    try {
      // Скидаємо видимість колонок
      const defaultVisibility: Record<string, boolean> = {}
      table.getAllColumns().forEach((column) => {
        if (column.getCanHide()) {
          column.toggleVisibility(true)
          defaultVisibility[column.id] = true
        }
      })
      table.setColumnVisibility(defaultVisibility)

      // Скидаємо порядок колонок
      const defaultOrder = table.getAllColumns().map((col) => col.id)
      table.setColumnOrder(defaultOrder)

      // Скидаємо сортування
      table.resetSorting()

      // Оновлюємо стан items до початкового порядку
      const defaultItems = table.getAllColumns().map((column) => ({
        id: column.id,
        label:
          typeof column.columnDef.header === "string"
            ? column.columnDef.header
            : column.id,
      }))
      setListState({
        items: defaultItems,
        lastCardMoved: null,
      })

      // Використовуємо resetSettings з хука
      resetSettings()

      // Додаємо сповіщення про успіх
      toast.success("Відновлено базові налаштування колонок")
    } catch (error) {
      // Додаємо сповіщення про помилку
      toast.error(
        error instanceof Error
          ? error.message
          : "Помилка при відновленні налаштувань",
      )
      console.error("Reset error:", error)
    }
  }

  // Оновлюємо порядок колонок в таблиці при зміні items
  const updateColumnOrder = React.useCallback(
    (newItems: Item[]) => {
      const newOrder = newItems.map((item) => item.id)
      table.setColumnOrder(newOrder)
    },
    [table],
  )

  // Обробник перетягування
  const reorderItem = React.useCallback(
    ({
      startIndex,
      indexOfTarget,
      closestEdgeOfTarget,
    }: {
      startIndex: number
      indexOfTarget: number
      closestEdgeOfTarget: Edge | null
    }) => {
      const finishIndex = getReorderDestinationIndex({
        startIndex,
        closestEdgeOfTarget,
        indexOfTarget,
        axis: "vertical",
      })

      if (finishIndex === startIndex) return

      setListState((prev) => {
        const newItems = reorder({
          list: prev.items,
          startIndex,
          finishIndex,
        })

        // Оновлюємо порядок колонок
        updateColumnOrder(newItems)

        return {
          items: newItems,
          lastCardMoved: {
            item: prev.items[startIndex],
            previousIndex: startIndex,
            currentIndex: finishIndex,
            numberOfItems: prev.items.length,
          },
        }
      })
    },
    [updateColumnOrder],
  )

  const [registry] = React.useState(getItemRegistry)

  // Isolated instances of this component from one another
  const [instanceId] = React.useState(() => Symbol("instance-id"))

  React.useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return isItemData(source.data) && source.data.instanceId === instanceId
      },
      onDrop({ location, source }) {
        const target = location.current.dropTargets[0]
        if (!target) {
          return
        }

        const sourceData = source.data
        const targetData = target.data
        if (!isItemData(sourceData) || !isItemData(targetData)) {
          return
        }

        const indexOfTarget = items.findIndex(
          (item) => item.id === targetData.item.id,
        )
        if (indexOfTarget < 0) {
          return
        }

        const closestEdgeOfTarget = extractClosestEdge(targetData)

        reorderItem({
          startIndex: sourceData.index,
          indexOfTarget,
          closestEdgeOfTarget,
        })
      },
    })
  }, [instanceId, items, reorderItem])

  // once a drag is finished, we have some post drop actions to take
  React.useEffect(() => {
    if (lastCardMoved === null) {
      return
    }

    const { item, previousIndex, currentIndex, numberOfItems } = lastCardMoved
    const element = registry.getElement(item.id)
    if (element) {
      triggerPostMoveFlash(element)
    }

    liveRegion.announce(
      `You've moved ${item.label} from position ${
        previousIndex + 1
      } to position ${currentIndex + 1} of ${numberOfItems}.`,
    )
  }, [lastCardMoved, registry])

  // cleanup the live region when this component is finished
  React.useEffect(() => {
    return function cleanup() {
      liveRegion.cleanup()
    }
  }, [])

  const getListLength = React.useCallback(() => items.length, [items.length])

  const contextValue: ListContextValue = React.useMemo(() => {
    return {
      registerItem: registry.register,
      reorderItem,
      instanceId,
      getListLength,
    }
  }, [registry.register, reorderItem, instanceId, getListLength])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          className={cx(
            "ml-auto flex min-h-[34px] gap-x-2 px-2 py-1.5 text-sm sm:text-xs",
          )}
        >
          <RiEqualizer2Line className="size-4" aria-hidden="true" />
          <span className="hidden sm:block">Колонки</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={7}
        className="z-50 w-fit space-y-2"
      >
        <div className="flex items-center justify-between">
          <Label className="font-medium">Опції відображення</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 px-2 text-xs text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
          >
            Скинути
          </Button>
        </div>
        <ListContext.Provider value={contextValue}>
          <div className="flex flex-col">
            {items.map((item, index) => {
              const column = table.getColumn(item.id)
              if (!column) return null
              return (
                <div
                  key={column.id}
                  className={cx(!column.getCanHide() && "hidden")}
                >
                  <ListItem column={column} item={item} index={index} />
                </div>
              )
            })}
          </div>
        </ListContext.Provider>
      </PopoverContent>
    </Popover>
  )
}
