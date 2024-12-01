"use client"
import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';

const store = (set : any) => ({
    address : null,
    provider : null,
    setAddress : (address : any) => set({address: address}),
    setProvider : (provider : any) => set({provider: provider})
})

const log = (config : any) => (set : any, get : any, api : any) =>
  config(
    (...args : any) => {
      console.log(args);
      set(...args);
    },
    get,
    api
  );

  

export const useStore = create(
    subscribeWithSelector(log(persist(devtools(store), { name: 'store' })))
  );
  