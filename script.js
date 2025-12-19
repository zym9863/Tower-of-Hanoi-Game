document.addEventListener('DOMContentLoaded', () => {
    const towers = document.querySelectorAll('.tower');
    const undoButton = document.getElementById('undo-button');
    const resetButton = document.getElementById('reset-button');
    const applyButton = document.getElementById('apply-button');
    const diskCountInput = document.getElementById('disk-count');
    const stepCounter = document.getElementById('step-counter');

    let draggedDisk = null;
    let moves = [];
    let stepCount = 0;
    let currentDiskCount = 3;

    // 生成盘子函数
    function generateDisks(count) {
        const towerA = document.getElementById('tower-a');
        towerA.innerHTML = ''; // 清空塔A

        // 计算每个盘子的宽度，确保视觉层级分明
        // 最小宽度为40%，最大为80%，均匀分布
        const minWidth = 40;
        const maxWidth = 80;
        const widthStep = (maxWidth - minWidth) / (count - 1);

        for (let i = 1; i <= count; i++) {
            const disk = document.createElement('div');
            disk.className = 'disk';
            disk.id = `disk-${i}`;
            disk.draggable = true;
            disk.textContent = i;

            // 设置盘子宽度
            const width = minWidth + (i - 1) * widthStep;
            disk.style.width = `${width}%`;

            towerA.appendChild(disk);
        }

        // 返回所有生成的盘子
        return towerA.querySelectorAll('.disk');
    }

    // 初始化盘子
    let disks = generateDisks(currentDiskCount);

    // 绑定盘子事件函数
    function bindDiskEvents(disks) {
        disks.forEach(disk => {
            // 拖动开始事件
            disk.addEventListener('dragstart', (event) => {
                draggedDisk = event.target;
                event.dataTransfer.setData('text/plain', event.target.id);
                setTimeout(() => {
                    event.target.classList.add('dragging');
                    event.target.classList.add('active-disk'); // 添加 active-disk 类
                }, 0);
            });

            // 拖动结束事件
            disk.addEventListener('dragend', (event) => {
                draggedDisk.classList.remove('dragging');
                event.target.classList.remove('active-disk'); // 移除 active-disk 类
                draggedDisk = null;
            });
        });
    }

    // 绑定初始盘子事件
    bindDiskEvents(disks);

    // 拖动进入事件
    towers.forEach(tower => {
        tower.addEventListener('dragover', (event) => {
            event.preventDefault(); // 允许放置
            if (isValidMove(draggedDisk, tower)) {
                tower.classList.add('valid-drop');
            } else {
                tower.classList.add('invalid-drop');
            }

        });

        tower.addEventListener('dragleave', () => {
            tower.classList.remove('valid-drop');
            tower.classList.remove('invalid-drop');
        });

        tower.addEventListener('drop', (event) => {
            event.preventDefault();
            const diskId = event.dataTransfer.getData('text/plain');
            const droppedDisk = document.getElementById(diskId);

            if (isValidMove(droppedDisk, tower)) {
                moves.push({ disk: droppedDisk, from: droppedDisk.parentNode, to: tower });
                tower.prepend(droppedDisk); // 放置在最上面
                updateStepCount(++stepCount);
                checkWin();
            }
            tower.classList.remove('valid-drop');
            tower.classList.remove('invalid-drop');
        });
    });

    // 检查是否是有效的移动
    function isValidMove(disk, tower) {
        if (!disk) return false;
        const topDisk = tower.querySelector('.disk');
        if (!topDisk) return true; // 塔为空，可以放置
        return parseInt(disk.id.split('-')[1]) < parseInt(topDisk.id.split('-')[1]);
    }
    
    // 检查是否获胜
    function checkWin() {
        const towerC = document.getElementById('tower-c');
        if (towerC.children.length === currentDiskCount) {
            alert(`恭喜你完成游戏！共用了 ${stepCount} 步。`);
        }
    }

    // 更新步数
    function updateStepCount(count) {
        stepCount = count;
        stepCounter.textContent = stepCount;
    }

    // 撤销功能
    undoButton.addEventListener('click', () => {
        if (moves.length > 0) {
            const lastMove = moves.pop();
            lastMove.from.prepend(lastMove.disk);
            updateStepCount(--stepCount);
        }
    });

    // 应用按钮功能
    applyButton.addEventListener('click', () => {
        const count = parseInt(diskCountInput.value);
        // 验证输入是否在有效范围内
        if (count >= 3 && count <= 8) {
            currentDiskCount = count;
            disks = generateDisks(currentDiskCount);
            bindDiskEvents(disks); // 重新绑定盘子事件

            // 清空所有塔并将新盘子放置在塔A
            towers.forEach(tower => tower.innerHTML = '');
            disks.forEach(disk => document.getElementById('tower-a').appendChild(disk));

            moves = [];
            updateStepCount(0);
        } else {
            alert('盘子数量必须在3-8之间！');
        }
    });

    // 重置功能
    resetButton.addEventListener('click', () => {
        // 重新生成当前数量的盘子并放置在塔A
        disks = generateDisks(currentDiskCount);
        bindDiskEvents(disks); // 重新绑定盘子事件

        // 清空其他塔
        document.getElementById('tower-b').innerHTML = '';
        document.getElementById('tower-c').innerHTML = '';

        moves = [];
        updateStepCount(0);
    });
});
