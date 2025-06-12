// import { rest } from 'msw'
import { http, HttpResponse } from 'msw'


const videoListA = [
  'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://www.w3schools.com/html/movie.mp4'
]
const videoListB = [
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  'https://media.w3.org/2010/05/sintel/trailer.mp4'
]

function genAllData(type = 'A', total = 100) {
  return Array.from({ length: total }).map((_, i) => {
    const width = 200
    const height = 200 + Math.floor(Math.random() * 200)
    const isVideo = Math.random() > 0.5
    return {
      id: i + 1,
      title: type === 'A'
        ? `标题${i + 1}`
        : `风格B-${i + 1}`,
      cover: type === 'A'
        ? `https://picsum.photos/${width}/${height}?random=${i}`
        : `https://placekitten.com/${width}/${height}`,
      coverWidth: width,
      coverHeight: height,
      type: isVideo ? 'video' : 'image',
      video: isVideo
        ? (type === 'A'
            ? videoListA[Math.floor(Math.random() * videoListA.length)]
            : videoListB[Math.floor(Math.random() * videoListB.length)])
        : ''
    }
  })
}

// export const handlers = [
//   rest.get('/api/discover', (req, res, ctx) => {
//     const page = Number(req.url.searchParams.get('page') || 1)
//     const pageSize = Number(req.url.searchParams.get('pageSize') || 20)
//     const type = req.url.searchParams.get('type') || 'A'

//     const all = genAllData(type, 100)
//     const list = all.slice((page - 1) * pageSize, page * pageSize)
//     return res(ctx.json({ list }))
//   }),

//   rest.get('/api/ping', (req, res, ctx) => {
//     return res(ctx.json({ message: 'pong' }))
//   })
// ]

export const handlers = [
    http.get('/api/ping', () => {
      return HttpResponse.json({ message: 'pong' })
    }),
  
    http.get('/api/discover', ({ request }) => {
      const url = new URL(request.url)
      const type = url.searchParams.get('type') || 'A'
      const page = Number(url.searchParams.get('page') || '1')
      const pageSize = Number(url.searchParams.get('pageSize') || '20')
  
      const all = genAllData(type, 100)
      const list = all.slice((page - 1) * pageSize, page * pageSize)
  
      return HttpResponse.json({ list })
    })
  ]
  
