# don状態遷移図

```mermaid
stateDiagram-v2
    [*] --> Ordered
    Ordered --> Cooking
    Cooking --> Calling
    Calling --> Finished
    Ordered --> Cancelled
    Cooking --> Cancelled
    Calling --> Cancelled
    Cancelled --> [*]
    Finished --> [*]
```
