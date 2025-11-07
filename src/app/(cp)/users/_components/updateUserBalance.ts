import axios from "axios"

export const updateUserKWTBalance = async ({
  id,
  WindBalance,
}: {
  id: string
  WindBalance: number
}) => {
  const response = await axios.post(
    `https://turbinex.pp.ua/user?uid=${id}`,
    {
      WindBalance,
    },
  )
  return response.data.data
}

export const updateUserTeam = async ({
  id,
  team,
}: {
  id: string
  team: string
}) => {
  const response = await axios.post(
    `https://turbinex.pp.ua/user?uid=${id}`,
    {
      team,
    },
  )
  return response.data.data
}

export const updateUserInvitedBy = async ({
  id,
  invitedBy,
}: {
  id: string
  invitedBy: string
}) => {
  const response = await axios.post(
    `https://turbinex.pp.ua/user?uid=${id}`,
    { invitedBy },
  )
  return response.data.data
}

export const updateUserReferalArray = async ({
  id,
  referalArray,
}: {
  id: string
  referalArray: string[]
}) => {
  const response = await axios.post(
    `https://turbinex.pp.ua/user?uid=${id}`,
    {
      referals: referalArray,
    },
  )
  return response.data.data
}

export const updateUserTONBalance = async ({
  id,
  TONBalance,
}: {
  id: string
  TONBalance: number
}) => {
  const response = await axios.post(
    `https://turbinex.pp.ua/user?uid=${id}`,
    {
      TONBalance,
    },
  )
  return response.data.data
}

export const replenishUserTONBalance = async ({
  wallet,
  amount,
}: {
  wallet: string
  amount: number
}) => {
  const response = await axios.post(
    `https://turbinex.pp.ua/transaction/ipn`,
    {
      to: wallet,
      amount: amount,
      txid: '1w23uui8890bbh1y7u9it5r2cv2g'
    },
  )
  return response.data
}

export const getUserData = async ({
  id,
}: {
  id: string
}) => {
  const response = await axios.get(
    `https://turbinex.pp.ua/user?tid=${id}`,
  )
  return response.data.data
}