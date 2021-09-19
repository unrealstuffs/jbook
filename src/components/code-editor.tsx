import "./code-editor.css";
import "./syntax.css";
// @ts-ignore
import { useRef } from "react";
// @ts-ignore
import MonacoEditor, { EditorDidMount } from "@monaco-editor/react";
// @ts-ignore
import prettier from "prettier";
// @ts-ignore
import parser from "prettier/parser-babel";
// @ts-ignore
import codeShift from "jscodeshift";
import Highlighter from "monaco-jsx-highlighter";

interface CodeEditorProps {
    initialValue: string;
    onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, initialValue }) => {
    const editorRef = useRef<any>();

    const onEditorDidMount: EditorDidMount = (
        getValue: any,
        monacoEditor: any
    ) => {
        editorRef.current = monacoEditor;
        monacoEditor.onDidChangeModelContent(() => {
            onChange(getValue());
        });

        monacoEditor.getModel()?.updateOptions({ tabSize: 2 });

        const highlighter = new Highlighter(
            // @ts-ignore
            window.monaco,
            codeShift,
            monacoEditor
        );
        highlighter.highLightOnDidChangeModelContent(
            () => {},
            () => {},
            undefined,
            () => {}
        );
    };

    const onFormatClick = () => {
        // get current value from editor
        const unformatted = editorRef.current.getModel().getValue();

        // format that value
        const formatted = prettier
            .format(unformatted, {
                parser: "babel",
                plugins: [parser],
                useTabs: false,
                semi: true,
                singleQuote: true,
            })
            .replace(/\n$/, "");

        // set the formatted value back in the editor
        editorRef.current.setValue(formatted);
    };

    return (
        // @ts-ignore
        <div className="editor-wrapper">
            <button
                className="button button-format is-primary is-small"
                onClick={onFormatClick}
            >
                Format
            </button>
            <MonacoEditor
                editorDidMount={onEditorDidMount}
                value={initialValue}
                theme="dark"
                language="javascript"
                height="100%"
                options={{
                    wordWrap: "on",
                    minimap: { enabled: false },
                    showUnused: false,
                    folding: false,
                    lineNumbersMinChars: 3,
                    fontSize: 16,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                }}
            />
        </div>
    );
};

export default CodeEditor;
