# Task 2 - Leo 入门：学会这门语言 

## 问题

**Q1. Leo 中的 "Private by Default"（默认隐私）语义是什么？**

A:`Leo`中所有变量和`record`字段默认都是`private`（私有的），即对链上其他参与者不可见。只有通过显式声明`public` 才会公开。这意味着开发者不需要额外操作就能保护数据隐私，隐私是内建的而非需要额外开启的特性。

---

**Q2. Tuple 包含 array structs 的示例，以及如何访问 struct 中的元素。**

A:

```leo
struct Point {
    x: u32,
    y: u32,
}

let t: ([u32; 3], Point) = ([1u32, 2u32, 3u32], Point { x: 10u32, y: 20u32 });

// 访问tuple元素
let arr: [u32; 3] = t.0;     // tuple第一个元素
let pt: Point = t.1;         // tuple第二个元素

// 访问struct字段
let x_val: u32 = pt.x;
let y_var: u32 = pt.y; 
```

---

**Q3. Aleo record 中 owner 字段的作用是什么？**

A:标识该`record`的所有者，是`record`的内置字段，用于：
1.确定谁有权spend这个`record`
2.在转账等操作中验证调用者是否为合法拥有者
3.默认为`private`，外部无法看到谁拥有这个`record`

---

**Q4. 程序中的 final 是什么？**

A:`final`用于定义链上终结逻辑 (Finalization)。它通常以`final {}`代码块或`final fn`的形式存在。这部分代码会在零知识证明验证通过后，在 `Aleo`链上公开执行，专门用于更新公共的链上状态

---

**Q5. 如何创建 helper functions（辅助函数）？**

A:使用`function`关键字定义，是程序内的私有函数

```leo
program my_app.aleo {
    transition compute(a: u32, b: u32) -> u32 {
        return helper_add(a, b);
    }

    function helper_add(x: u32, y: u32) -> u32 {
        return x + y; 
    }
}
```

`transition`是公开可调用的入口，`function`是内部辅助函数，只能被同一程序内的`transition`或其他`function`调用

---

**Q6. helper functions 能否创建 records？**

A:不能，只有`transition`能创建`records`，`record`的创建需要在`transition`级别进行状态变更

---

**Q7. constructor 的目的是什么？**

A:一种特殊的`transition`，专门用于初始化程序状态，它在程序部署时执行一次，用于创建初始的`record`或设置程序的初始状态

---

**Q8. 如何组合多个 interfaces（接口）？**

A:用 + 运算符组合

```leo
interface HasX {
    x: u32,
}

interface HasY {
    y: u32,
}

// 组合两个interface
transition foo<T: HasX + HasY>(input: T) -> u32 {
    return input.x + input.y;
}
```

---

**Q9. record interface 中 `..` 的含义是什么？**

A:`..`表示忽略剩余字段的匹配，允许只匹配关心的字段，而不需要列出`record`的所有字段

---

**Q10. 何时使用 dyn record（动态 record）？**

A:当函数需要处理不同类型但都满足某个`interface`约束的`record`时使用，eg：
1.同一个`transition`需要处理多种`token`类型
2.需要编写通用的`record`处理逻辑，不绑定具体的`record`类型

```leo
transition transfer<T: HasOwner + HasAmount>(
    input_record: T,
    to: address,
    amount: u64
) -> T {
    // 处理任意满足接口的record
}
```

---

**Q11. storage vector 支持的核心操作有哪些？**

A:
`push` -> 在末尾添加元素
`get` -> 按索引获取元素
`set` -> 按索引更新元素
`swap_remove` -> 移除指定索引元素，并将该元素返回
`len` -> 获取当前的长度
`pop` -> 弹出并返回末尾的元素
