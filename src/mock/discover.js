import Mock from 'mockjs'

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
        ? Mock.Random.ctitle(8, 16)
        : Mock.Random.ctitle(4, 8) + '【风格B】',
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

console.log('discover')

export default [
  {
    url: '/api/discover',
    method: 'get',
    response: ({ query }) => {
      const page = Number(query.page) || 1
      const pageSize = Number(query.pageSize) || 20
      const type = query.type || 'A'
      const all = genAllData(type, 100)
      const list = all.slice((page - 1) * pageSize, page * pageSize)
      return { list }
    }
  }, 
  {
    url: '/api/ping',
    method: 'get',
    response: () => {
      return {
        message: 'pong'
      }
    }
  }
]
