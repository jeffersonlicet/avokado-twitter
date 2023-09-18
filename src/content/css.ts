export const svg = `  <path fill="transparent" stroke-width="2"
id="primary" d="M18.38,11.73c-.16-.43-.33-.82-.52-1.24a9.5,9.5,0,0,1-1-3.38,5.38,5.38,0,0,0-2.32-4.36,4.78,4.78,0,0,0-5.08,0A5.38,5.38,0,0,0,7.14,7.11a9.5,9.5,0,0,1-1,3.38c-.19.42-.36.81-.52,1.24A10.29,10.29,0,0,0,5,15.67C5,19.16,8.14,22,12,22s7-2.84,7-6.33A10.29,10.29,0,0,0,18.38,11.73Z" style="fill: transparent;" stroke="currentColor"></path><circle id="secondary" cx="12" cy="15" r="3" style="fill: currentcolor"></circle>`;

export const style = `


.emoji-container {
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
  width: 28px;
  height: 28px;
  justify-content: center;
  align-items: center;
  display: flex;
  cursor: pointer;
}

.emoji-container:hover {
  background: rgba(83, 100, 113, 0.1);
}

.emoji-container:hover .emojiMax {
  //transform: scale(1.13);
}
.emojiMax {
  width: 20px;
  height: 20px;
  transition: transform 0.2s;
}

.tooltip {
    position: absolute;
    color: #333;
    padding: 6px 12px;
    border-radius: 25px;
    box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);
    z-index: 9999;
    display: flex;
    bottom: 120%;
    background: #fff;
    left: 0%;
    visibility: hidden;
    transform : translateY(-10px) scale(0.8);
    transition: all 0.2s cubic-bezier(0, 0.67, 0, 1.18);
    opacity: 0;
  }

  .tooltip .item {
    padding: 3px 3px;
    margin: 0 3px;
  }
  
  .twitter-button:hover + .tooltip {
    display: block;
  }
  
  .show-tooltip {
    visibility: visible;
    transform : translateY(0) scale(1);
    opacity: 1;
  }
  
  .thumb {
    opacity: 1;
  }
`;
