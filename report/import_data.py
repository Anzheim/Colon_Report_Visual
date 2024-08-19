def readfile(file):
    content = file.read().decode('utf-8')
    # 分割每一行
    lines = content.strip().split('\n') # 去掉首尾空格，然后以換行符分割
    patientName = lines[0].split(' ')[1]
    # patientName 去除回車符
    patientName = patientName.replace('\r', '')
    
    # 找到focus的index
    focus_data = []
    for i, line in enumerate(lines):
        if line.startswith('Focus'):
            focus_index = i
            break
    for line in lines[focus_index+1:]:
        parts = line.split() # 以空格分割每一行
        if len(parts) >= 5:
            num = parts[0].replace('.', '')
            focus = parts[1]
            position = parts[2]
            mark = parts[3]
            size = parts[4]
        print(num, focus, position, mark, size)
        print(type(num), type(focus), type(position), type(mark), type(size))
        focus_data.append([num, focus, position, mark, size])
    return patientName, focus_data