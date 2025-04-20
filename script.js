document.addEventListener('DOMContentLoaded', () => {
    const towers = document.querySelectorAll('.tower');
    const disks = document.querySelectorAll('.disk');
    const undoButton = document.getElementById('undo-button');
    const resetButton = document.getElementById('reset-button');
    const stepCounter = document.getElementById('step-counter');

    let draggedDisk = null;
    let moves = [];
    let stepCount = 0;

    // 初始化盘子
    const initialTower = document.getElementById('tower-a');
    const initialDisks = Array.from(initialTower.querySelectorAll('.disk')).sort((a, b) => parseInt(b.id.split('-')[1]) - parseInt(a.id.split('-')[1]));
    initialTower.innerHTML = ''; // 清空初始塔
    initialDisks.forEach(disk => initialTower.appendChild(disk));

    // 拖动开始事件
    disks.forEach(disk => {
        disk.addEventListener('dragstart', (event) => {
            draggedDisk = event.target;
            event.dataTransfer.setData('text/plain', event.target.id);
            setTimeout(() => {
                event.target.classList.add('dragging');
                event.target.classList.add('active-disk'); // 添加 active-disk 类
            }, 0);
        });

        disk.addEventListener('dragend', () => {
            draggedDisk.classList.remove('dragging');
            event.target.classList.remove('active-disk'); // 移除 active-disk 类
            draggedDisk = null;
        });
    });

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
        if (towerC.children.length === 3) {
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

    // 重置功能
    resetButton.addEventListener('click', () => {
        const towerA = document.getElementById('tower-a');
        const initialDisks = Array.from(disks).sort((a, b) => parseInt(b.id.split('-')[1]) - parseInt(a.id.split('-')[1]));
        
        // 清空所有塔
        towers.forEach(tower => tower.innerHTML = '');

        // 将盘子放回塔A
        initialDisks.forEach(disk => towerA.appendChild(disk));

        moves = [];
        updateStepCount(0);
    });
});
