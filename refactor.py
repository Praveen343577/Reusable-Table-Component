import os
import re

src_dir = r'c:\Users\1000863\Desktop\26mar26\reusable table component\reusable-table-component\src'

table_css_path = os.path.join(src_dir, 'Components', 'Table', 'Table.module.css')

def get_relative_path(from_path, to_path):
    rel = os.path.relpath(to_path, os.path.dirname(from_path)).replace(os.sep, '/')
    if not rel.startswith('.'): rel = './' + rel
    return rel

for root, _, files in os.walk(src_dir):
    for f in files:
        if f.endswith('.jsx'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # Replace CSS imports
            content = re.sub(r'import\s+[\'"](.*?)(\.css)[\'"]', r'import localStyles from "\1.module.css"', content)
            
            rel_table_css = get_relative_path(path, table_css_path)
            
            if 'import tableStyles' not in content and 'Table.jsx' not in f and 'App.jsx' not in f and 'index.js' not in f:
                content = f'import tableStyles from "{rel_table_css}";\n' + content

            style_decl = '\nconst styles = { ...tableStyles, ...(typeof localStyles !== "undefined" ? localStyles : {}) };\n'
            if 'Table.jsx' in f:
                style_decl = '\nconst styles = localStyles;\n'
            
            if 'const styles =' not in content and 'App.jsx' not in f and 'index.js' not in f:
                last_import_idx = content.rfind('import ')
                if last_import_idx != -1:
                    end_of_line = content.find('\n', last_import_idx)
                    content = content[:end_of_line+1] + style_decl + content[end_of_line+1:]
            
            # Static class replacements
            def repl_static_class(m):
                classes = m.group(1).split()
                if len(classes) == 1:
                    return f'className={{styles["{classes[0]}"]}}'
                else:
                    joined = ' '.join([f'styles["{c}"]' for c in classes])
                    return f'className={{[{joined}].filter(Boolean).join(" ")}}'
            
            if 'App.jsx' not in f and 'index.js' not in f:
                content = re.sub(r'className=["\']([a-zA-Z0-9_\-\s]+)["\']', repl_static_class, content)
            
            # App.jsx manual inject
            if 'App.jsx' in f:
                if 'import tableStyles' not in content:
                    content = f'import tableStyles from "{get_relative_path(path, table_css_path)}";\n' + content
                content = content.replace('className="driver-wrapper"', 'className={tableStyles["driver-wrapper"]}')
                content = content.replace('className="driver-avatar"', 'className={tableStyles["driver-avatar"]}')
                content = re.sub(r'className=\{`status-chip status-\$\{row\.status\.toLowerCase\(\)\}`\}', r'className={`${tableStyles["status-chip"]} ${tableStyles["status-" + row.status.toLowerCase()]}`}', content)
            
            # Dynamic classes in components
            if 'Table.jsx' in f:
                content = content.replace('className="ct-container"', 'className={styles["ct-container"]}')
                content = content.replace('className="ct-table-wrapper"', 'className={styles["ct-table-wrapper"]}')
                content = content.replace('className="ct-table"', 'className={styles["ct-table"]}')
            
            with open(path, 'w', encoding='utf-8') as file:
                file.write(content)
