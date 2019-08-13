# Macros

> Brings simple, powerful custom macros support to VS Code.
Made with <3 by [geddski](http://gedd.ski)
>
>See also [Level up your Coding with Macros](http://gedd.ski/post/level-up-coding-with-macros/)
>
based on [macrosRe](https://github.com/l7ssha) + [New Features](#new)

# Original

> ## Create Custom Macros

Create your own custom macros by adding them to your `settings.json` (Code|File > Preferences > User Settings)

For example:

```json
"macros.list": {
    "commentDown": [
        "editor.action.copyLinesDownAction",
        "cursorUp",
        "editor.action.addCommentLine",
        "cursorDown"
    ]
}
```

This macro creates a copy of the current line, comments out the original line, and moves the cursor down to the copy.

Your macros can run any built-in VS Code action, and even actions from other extensions.
To see all the names of possible actions VS Code can run, see `Default Keyboard Shortcuts` (Code|File > Preferences > Keyboard Shortcuts)

Give your macros names that briefly describe what they do.

> ## Add Keybindings to Run your Macros

in `keybindings.json` (Code|File > Preferences > Keyboard Shortcuts) add bindings to your macros:

```json
{
  "key": "ctrl+cmd+/",
  "command": "macros.commentDown"
}
```

Notice that `macros.my_macro_name` has to match what you named your macro.

> ## Passing Arguments to Commands

Many commands accept arguments, like the "type" command which lets you insert text into the editor. For these cases use an object instead of a string when specifying the command to call in your `settings.json`:

```json
"macros.list": {
  "addSemicolon": [
    "cursorEnd",
      {"command": "type", "args": {"text": ";" }}
  ]
}
```

> ## Executing Snippets As Part Of A Macro

Macros can also execute any of your snippets which is super neat. Just insert the same text that you would normally type for the snippet, followed by the `insertSnippet` command:

```json
"macros.list": {
  "doMySnippet": [
    {"command": "type", "args": {"text": "mySnippetPrefixHere" }},
    "insertSnippet"
  ]
}
```

<br>

# New

> ## Run macro From command pallete

simply use `Ctrl+P` or `Alt+P` depend on your os, and type `Macros:Execute` then chose the macro you want to execute.

> ## Run Commands With A Delay

```json
"macros.list": {
    "createNewTabAndPaste": [
        "workbench.action.files.newUntitledFile",
        {
            "command": "$delay",
            "args": {
                "delay": 50
            }
        },
        "editor.action.clipboardPasteAction"
    ]
}
```

> ## Run A Command Times Another Command [#48](https://github.com/geddski/macros/issues/48)

```json
"macros.list": {
    "undoCommentDown": [
        {
            "command": "undo",
            "args": {
                "command": "commentDown"
            }
        }
    ]
}
```

> ## Repeat A Command [#36](https://github.com/geddski/macros/issues/36)

```json
"macros.list": {
    "commentDown10": [
        {
            "command": "commentDown",
            "args": {
                "times": 10
            }
        }
    ]
}
```

> ## In/Ex-clude Commands From The Quick Picker "allow take precedence over ignore"

```json
"macros.list": {
    "delay-100": [
        {
            "command": "$delay",
            "args": {
                "delay": 100
            }
        }
    ],
    "some-other-cmnd": [
        // ...
    ],
},
"macros.qp-allow": [
    "some-other-cmnd",
],
"macros.qp-ignore": [
    "delay-100",
],
```
