nodeRepository -> nodeTree -> NodeBank -> NodeEditor -> PipelineNode

- output panel
- upload image input
- url just for execution (only input and output in a nice UX/UI)
- history
- cost
- mark which property is mandatory

- values

  - text input or "add value" button
  - https://ant.design/components/cascader
  - NTH? - create new properties (replaceMutipleStrings)

- create input/output frontend components for easy invocation/consumption
  - ability to setup demo inputs (upload audio, image, text)
  - NTH - define which demo inputs will be available when sharing
- delete node
- explanation about the node when editing/hovering (also in nodebank)
  - this node takes a string and a modifier and...

---

- rename node
- disable edit if not connected
  - tooltip
- link to rest api to invoke the pipeline
  - saving in db is not mandatory if the state is serialized in the url
  - NTH - invoke using aigur client?
  - NTH - production link and versioned link (each "save" creates a new version, can promote a version to production)
- login
  - email/social
- save in db
  - create an org

add tasks to project and share with matt
