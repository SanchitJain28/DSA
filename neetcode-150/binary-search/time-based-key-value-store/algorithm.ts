interface TimeMapValue {
  timestamp: number;
  value: string;
}

class TimeMap {
  private keyStore: Map<string, TimeMapValue[]>;
  constructor() {
    this.keyStore = new Map();
  }
  set(key: string, value: string, timestamp: number): void {
    const newValue = { value, timestamp };
    const values = this.keyStore.get(key);
    if (values) values.push(newValue);
    else this.keyStore.set(key, [newValue]);
  }
  get(key: string, timestamp: number): string {
    const values = this.keyStore.get(key);
    if (!values) return "";
    let left = 0;
    let right = values.length - 1;
    let answer = -1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (values[mid].timestamp <= timestamp) {
        answer = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    return answer === -1 ? "" : values[answer].value;
  }
}

// Design a time-based key-value data structure that can store multiple values for the same key at different time stamps and retrieve the key's value at a certain timestamp.

// Implement the TimeMap class:

// TimeMap() Initializes the object of the data structure.
// void set(String key, String value, int timestamp) Stores the key key with the value value at the given time timestamp.
// String get(String key, int timestamp) Returns a value such that set was called previously, with timestamp_prev <= timestamp. If there are multiple such values, it returns the value associated with the largest timestamp_prev. If there are no values, it returns "".

// Input:
// ["TimeMap", "set", ["alice", "happy", 1], "get", ["alice", 1], "get", ["alice", 2], "set", ["alice", "sad", 3], "get", ["alice", 3]]

// Output:
// [null, null, "happy", "happy", null, "sad"]

// Explanation:
// TimeMap timeMap = new TimeMap();
// timeMap.set("alice", "happy", 1);  // store the key "alice" and value "happy" along with timestamp = 1.
// timeMap.get("alice", 1);           // return "happy"
// timeMap.get("alice", 2);           // return "happy", there is no value stored for timestamp 2, thus we return the value at timestamp 1.
// timeMap.set("alice", "sad", 3);    // store the key "alice" and value "sad" along with timestamp = 3.
// timeMap.get("alice", 3);           // return "sad"
