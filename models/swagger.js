module.exports = {
  "Item":{
    "id":"Item",
    "required": ["id"],
    "properties":{
      "id":{
        "type":"integer",
        "format": "int64",
        "description": "Item unique identifier",
        "minimum": "0.0"
      },
      "name":{
        "type":"string",
        "description": "Item contents"
      }
    }
  }
}
