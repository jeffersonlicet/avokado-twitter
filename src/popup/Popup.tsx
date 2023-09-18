import './Popup.css';

import Button from '@mui/material/Button';
import { Box, Checkbox, Typography } from '@mui/material';
import useLocalStorage from './hooks/useLocalStorage';
import { Twitter } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';

const label = { inputProps: { 'aria-label': 'Auto Send Emojis' } };

const key = 'autoSend';
const keyResponses = 'autoSendResponses';

interface Store {
  autoSend: boolean;
  autoSendResponses: boolean;
}

let connection: chrome.runtime.Port | null = null;

function App() {
  const [autoSend, setValue] = useState(false);
  const [autoResponses, setAutoResponsesValue] = useState(false);

  useEffect(() => {
    function connect() {
      if (connection) {
        return;
      }

      connection = chrome.runtime.connect({ name: 'popup' });

      connection.onDisconnect.addListener(() => {
        connection = null;
        connect();
      });

      connection.onMessage.addListener((message) => {
        setValue(message.store.autoSend);
        setAutoResponsesValue(message.store.autoSendResponses);
      });
    }

    connect();
  }, []);

  return (
    <>
      <Box
        alignContent="center"
        alignItems="center"
        display="flex"
        justifyContent="center"
        width="350px"
        height="80px"
      >
        <svg
          width="30"
          height="30"
          color="white"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="transparent"
            strokeWidth="2"
            id="primary"
            d="M18.38,11.73c-.16-.43-.33-.82-.52-1.24a9.5,9.5,0,0,1-1-3.38,5.38,5.38,0,0,0-2.32-4.36,4.78,4.78,0,0,0-5.08,0A5.38,5.38,0,0,0,7.14,7.11a9.5,9.5,0,0,1-1,3.38c-.19.42-.36.81-.52,1.24A10.29,10.29,0,0,0,5,15.67C5,19.16,8.14,22,12,22s7-2.84,7-6.33A10.29,10.29,0,0,0,18.38,11.73Z"
            stroke="currentColor"
          ></path>
          <circle id="secondary" cx="12" cy="15" r="3" fill="currentColor"></circle>
        </svg>
        <Typography
          paddingLeft="8px"
          fontSize="28px"
          color="white"
          fontFamily="nunito"
          fontWeight="900"
          textTransform="uppercase"
        >
          Avokado
        </Typography>
      </Box>

      <Box
        sx={{ boxShadow: 1 }}
        bgcolor="#DBFFEE"
        borderRadius="15px 15px 0 0"
        p={'15px 20px'}
        minHeight="100vh"
      >
        <Box mt="10px">
          <Typography mb="10px" fontWeight="700" fontFamily="nunito">
            Settings
          </Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography fontFamily="nunito">Auto Send Emojis</Typography>
            <Checkbox
              {...label}
              sx={{
                '& .MuiSvgIcon-root': { fontSize: 28 },
                color: 'black',
                '&.Mui-checked': {
                  color: 'black',
                },
              }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                connection?.postMessage({
                  store: {
                    autoSend: event.target.checked,
                    autoSendResponses: autoResponses,
                  },
                  type: 'setStore',
                });
                setValue(event.target.checked);
              }}
              checked={autoSend}
            />
          </Box>

          <Box display="none" justifyContent="space-between" alignItems="center">
            <Typography fontFamily="nunito">Auto Send Responses</Typography>
            <Checkbox
              {...label}
              sx={{
                '& .MuiSvgIcon-root': { fontSize: 28 },
                color: 'black',
                '&.Mui-checked': {
                  color: 'black',
                },
              }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                connection?.postMessage({
                  store: {
                    autoSend,
                    autoSendResponses: event.target.checked,
                  },
                  type: 'setStore',
                });
                setAutoResponsesValue(event.target.checked);
              }}
              checked={autoResponses}
            />
          </Box>
          {/*<Typography fontWeight="700" fontFamily="nunito">
            DEFAULT EMOJIS
  </Typography>*/}
          {/* <EmojiPicker width="300px" />*/}
        </Box>

        <Box mt="10px">
          <Typography mb="10px" fontWeight="700" fontFamily="nunito">
            Share
          </Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Button
              onClick={() => {
                chrome.tabs.create({
                  url: 'https://twitter.com/intent/tweet?text=Try%20Avokado%20Emojis%20for%20Twitter%20https://chrome.google.com/webstore/detail/avokado-for-twitter/khhojokaifahclmdcapmjiifoghaemkl',
                });
              }}
              style={{
                boxShadow: 'none',
              }}
              className="customButton"
              sx={{
                background: '#FFE0DB',
                border: '1px solid #000',
                color: 'black',
              }}
              startIcon={<Twitter />}
              variant="contained"
            >
              Tweet About Avokado
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default App;
