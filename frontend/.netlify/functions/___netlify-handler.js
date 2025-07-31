const { createRequestHandler } = require('@netlify/remix-adapter')
const { installGlobals } = require('@remix-run/node')

installGlobals()

const handler = createRequestHandler({
  build: require('../../.next/server/app'),
  mode: process.env.NODE_ENV,
})

exports.handler = async (event, context) => {
  return handler(event, context)
} 