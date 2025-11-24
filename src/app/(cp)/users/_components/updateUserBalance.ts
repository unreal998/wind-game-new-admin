import axios from "axios"

export const updateUserKWTBalance = async ({
  id,
  WindBalance,
}: {
  id: string
  WindBalance: number
}) => {
  const response = await axios.post(
    `https://6d6ed6665a16.ngrok-free.app/user?uid=${id}`,
    {
      WindBalance,
    },
    {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
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
    `https://6d6ed6665a16.ngrok-free.app/user?uid=${id}`,
    {
      team,
    },
    {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
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
    `https://6d6ed6665a16.ngrok-free.app/user?uid=${id}`,
    { invitedBy },
    {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    },
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
    `https://6d6ed6665a16.ngrok-free.app/user?uid=${id}`,
    {
      referals: referalArray,
    },
    {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
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
    `https://6d6ed6665a16.ngrok-free.app/user?uid=${id}`,
    {
      TONBalance,
    },
    {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
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
    `https://6d6ed6665a16.ngrok-free.app/transaction/ipn`,
    {
      to: wallet,
      amount: amount,
      txid: '1w23uui8890bbh1y7u9it5r2cv2g'
    },
    {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
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
    `https://6d6ed6665a16.ngrok-free.app/user?tid=${id}`,
    {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    },
  )
  return response.data.data
}