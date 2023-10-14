import axios from 'axios';

const instance = axios.create({ baseURL: process.env.NEXT_APP_ROUTE });

instance.interceptors.request.use(config => 
{
  const { url } = config;

  if (url.startsWith('/a/'))
  {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    config.data = { ...config.data, accessToken, refreshToken };
  }

  return config;
});

instance.interceptors.response.use(
  (res) => 
  {
    if (res.data.newAccessToken)
      localStorage.setItem('accessToken', res.data.newAccessToken);

    return res;
  },
  (err) => { return Promise.reject(err) }
);

export function setResponseError(err, dispatch)
{
  if (err.clientSide) 
  {
    dispatch(
    {
      type: 'setNotification',
      payload: 
      { 
        type: "error",
        header: err.header,
        message: err.message 
      } 
    })
  }

  else if (err.response)
  {
    dispatch(
    {
      type: 'setNotification',
      payload: 
      { 
        type: "error",
        header: err.response.data.header,
        message: err.response.data.message 
      } 
    })
  }

  else
  {
    dispatch(
    {
      type: 'setNotification',
      payload: 
      { 
        type: "error",
        header: "Failed to perform action",
        message: "Failed to communicate with server"
      } 
    })
  }

  dispatch({ type: 'notificationShown', payload: true });
}

export function setResponseConfirmation(header, message, dispatch)
{
  dispatch(
  {
    type: 'setNotification',
    payload: 
    { 
      type: "confirmation",
      header: header,
      message: message
    } 
  })

  dispatch({ type: 'notificationShown', payload: true })
}

export default instance;