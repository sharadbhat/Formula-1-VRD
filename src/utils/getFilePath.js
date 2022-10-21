const getDataFilePath = (filename) => {
    const env = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 'dev' : 'prod'

    if (env === 'dev') {
        return `data/${filename}`
    }
    return `/Formula-1-VRD/data/${filename}`
}

const getSketchFilePath = (filename) => {
    const env = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 'dev' : 'prod'

    if (env === 'dev') {
        return `sketches/${filename}`
    }
    return `/Formula-1-VRD/sketches/${filename}`
}

export {
    getDataFilePath,
    getSketchFilePath
}