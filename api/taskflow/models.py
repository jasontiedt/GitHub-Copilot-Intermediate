from dataclasses import dataclass, field


@dataclass
class Task:
    id: int
    title: str
    status: str  # "todo" | "in_progress" | "done"
    assignee: str
    priority: int  # 1..5 (5 = highest)
    tags: list[str] = field(default_factory=list)
