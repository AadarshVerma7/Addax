import React from 'react'
import Transcripts from './Transcript'

function MapTranscipts() {
  return (
    <>
    <div className='w-2xl p-2 border border-gray-600/40 rounded-2xl m-4 flex flex-col justify-top items-center gap-2'>

        <Transcripts
        duration='10:12'
        text='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos magnam, non tempora cumque, deserunt vero delectus sapiente molestiae repellat autem facere, temporibus ipsum explicabo mollitia asperiores suscipit iste voluptates rerum?'
        />
        <Transcripts
        duration='10:12'
        text='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos magnam, non tempora cumque, deserunt vero delectus sapiente molestiae repellat autem facere, temporibus ipsum explicabo mollitia asperiores suscipit iste voluptates rerum?'
        />
        <Transcripts
        duration='10:12'
        text='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos magnam, non tempora cumque, deserunt vero delectus sapiente molestiae repellat autem facere, temporibus ipsum explicabo mollitia asperiores suscipit iste voluptates rerum?'
        />
        </div>
    </>
  )
}

export default MapTranscipts