var Hash = require('hashish')
  , querystring = require('querystring')

/**
 * A URL parser that acts more like a browsers address bar and fills in 
 * default values for different parts of the URL.
 *
 * Only http and https are supported.
 */
function parseurl(str, qs) {
  var options =
    { protocol: 'http:'
    , port: '80'
    , host: null
    , hostname: null
    , href: null
    , hash: null
    , search: null
    , query: null
    , pathname: null
    }

  // Unravel the mystery with these clues::
  //
  //            |protocol|        |auth string       |    |hostname      |  |prt|    |path   | |query    | |hsh|
  var regex = /^((https?:)?\/\/)?(([a-zA-Z0-9+._:-]+)@)?(([a-zA-Z0-9.-]+)(:(\d+))?)?((\/[^?]*)?(\?([^#]*))?(#.*)?)?$/
  var groups = regex.exec(str)
    , mapping =     // This is used to map fields to group numbers in the regex
      { protocol: 2
      , host: 5
      , hostname: 6
      , port: 8
      , search: 11
      , query: 12
      , hash: 13
      , pathname: 10
      , auth: 4
      }

  // Failure. Maybe throw an exception?
  if (!groups) {
    return null
  }

  // Set default port to 443 for ssl
  if (groups[2] == 'https:') {
    options.port = 443
  }

  // Parse groups
  if (groups) {
    Hash(mapping).forEach(function(v,k) {
      if (groups[v]) {
        options[k] = groups[v]
      }
    })
  }

  // Build an absolute URL for href
  if (options.host) {
    options.href = options.protocol+'//'+(options.auth ? options.auth+'@' : '')+options.host+(groups[9] ? groups[9] : '/')
  } else {
    options.href = groups[9] ? groups[9] : '/'
  }

  // parse query string
  if (qs && options.query) {
    options.query = querystring.parse(options.query)
  }

  return options
}

exports.parse = parseurl

