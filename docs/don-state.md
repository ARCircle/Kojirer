# don状態遷移図

```mermaid
stateDiagram-v2
    [*] --> Ordered
    Ordered --> Cooking
    Cooking --> Cooked
    Cooked --> Delivered
    Ordered --> Cancelled
    Cooking --> Cancelled
    Calling --> Cancelled
    Cancelled --> [*]
    Delivered --> [*]
```
