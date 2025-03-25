import { create } from 'zustand'

interface ClickerState {
  clickValue: number
  clickMultiplier: number
  isAnimating: boolean
  upgradesPurchased: Record<string, number>

  incrementClicks: () => number
  setIsAnimating: (value: boolean) => void
  increaseClickValue: (value: number) => void
  increaseMultiplier: (value: number) => void
  purchaseUpgrade: (upgradeId: string) => void
}

interface Upgrade {
  id: string
  name: string
  description: string
  cost: number
  baseValue: number
  valueMultiplier: number
  currentLevel: number
  getValue: () => number
  getCost: () => number
}

const UPGRADES: Record<string, Omit<Upgrade, 'currentLevel' | 'getValue' | 'getCost'>> = {
  clickValue: {
    id: 'clickValue',
    name: 'Click Value',
    description: 'Increases the value of each click',
    cost: 10,
    baseValue: 1,
    valueMultiplier: 1.5
  },
  clickMultiplier: {
    id: 'clickMultiplier',
    name: 'Click Multiplier',
    description: 'Multiplies the value of your clicks',
    cost: 50,
    baseValue: 0.1,
    valueMultiplier: 1.3
  }
}

export const useClickerStore = create<ClickerState>((set, get) => ({
  clickValue: 1,
  clickMultiplier: 1,
  isAnimating: false,
  upgradesPurchased: {
    clickValue: 0,
    clickMultiplier: 0
  },

  incrementClicks: () => {
    const { clickValue, clickMultiplier } = get()
    // 클릭 UI 애니메이션을 위한 함수로만 사용하고 항상 1을 반환
    return 1
  },

  setIsAnimating: (value) => set({ isAnimating: value }),

  increaseClickValue: (value) =>
    set((state) => ({
      clickValue: state.clickValue + value
    })),

  increaseMultiplier: (value) =>
    set((state) => ({
      clickMultiplier: state.clickMultiplier + value
    })),

  purchaseUpgrade: (upgradeId) => {
    const { upgradesPurchased } = get()

    set({
      upgradesPurchased: {
        ...upgradesPurchased,
        [upgradeId]: (upgradesPurchased[upgradeId] || 0) + 1
      }
    })

    if (upgradeId === 'clickValue') {
      get().increaseClickValue(
        UPGRADES.clickValue.baseValue * Math.pow(UPGRADES.clickValue.valueMultiplier, upgradesPurchased[upgradeId] || 0)
      )
    } else if (upgradeId === 'clickMultiplier') {
      get().increaseMultiplier(
        UPGRADES.clickMultiplier.baseValue *
          Math.pow(UPGRADES.clickMultiplier.valueMultiplier, upgradesPurchased[upgradeId] || 0)
      )
    }
  }
}))

export const getUpgradesList = (): Upgrade[] => {
  const { upgradesPurchased } = useClickerStore.getState()

  return Object.values(UPGRADES).map((upgrade) => {
    const currentLevel = upgradesPurchased[upgrade.id] || 0

    return {
      ...upgrade,
      currentLevel,
      getValue: () => upgrade.baseValue * Math.pow(upgrade.valueMultiplier, currentLevel),
      getCost: () => Math.round(upgrade.cost * Math.pow(1.8, currentLevel))
    }
  })
}
