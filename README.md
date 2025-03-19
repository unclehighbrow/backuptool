# This is backuptool, a tool for snapshotting the contents of a directory and then restoring it.

## Install
You should have postgres preinstalled. This was written and tested with postgres 15, but any recent version should do. 
Then, just initalize the database with:
  ```npm run init```

## Tests
To run the tests:
  ```npm run test```

## Usage
After you initialize the database, you can `snapshot`, `list`, `restore`, and `prune`.

### Snapshot
  ```npm run backuptool snapshot {directory_path}```

### List
  To see a list of the snapshots you've made:
  ```npm run backuptool list```

### Restore
  To restore your snapshot, provide the id of the snapshot you found in the list like so:
  ```npm run backuptool restore {id} {directory_path}```

### Prune
  To remove a snapshot, find the id in list and then:
  ```npm run backuptool prune {id}```


  
