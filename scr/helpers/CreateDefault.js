const Group = require('../models/Group')

async function GroupChiDefault (fromId, walletId) {
    let grparent1 = new Group({
        name: 'Gia đình',
        image: 'https://firebasestorage.googleapis.com/v0/b/moneysaver-acdd1.appspot.com/o/icons%2F49.png?alt=media&token=0c762736-ae40-4edf-a483-13deb32ac009',
        type: 0,
        fromId: fromId,
        walletId: walletId
    });
    grparent1.parent = grparent1._id

    let grparent2 = new Group({
        name: 'Vui chơi',
        image: 'https://firebasestorage.googleapis.com/v0/b/moneysaver-acdd1.appspot.com/o/icons%2F25.png?alt=media&token=e2159eb2-b9f6-446f-9dd8-00d935c1e72b',
        type: 0,
        fromId: fromId,
        walletId: walletId
    });
    grparent2.parent = grparent2._id

    let grchil1_1 = new Group({
        name: 'Di chuyển',
        image: 'https://firebasestorage.googleapis.com/v0/b/moneysaver-acdd1.appspot.com/o/icons%2F46.png?alt=media&token=14877208-2837-4a29-98d6-f0826d227885',
        type: 0,
        parent: grparent1._id,
        fromId: fromId,
        walletId: walletId
    });
    let grchil1_2 = new Group({
        name: 'Quần áo',
        image: 'https://firebasestorage.googleapis.com/v0/b/moneysaver-acdd1.appspot.com/o/icons%2F37.png?alt=media&token=e2bba860-92d6-4381-ba11-60c683b277a1',
        type: 0,
        parent: grparent1._id,
        fromId: fromId,
        walletId: walletId
    });
    let grchil1_3 = new Group({
        name: 'Ăn uống',
        image: 'https://firebasestorage.googleapis.com/v0/b/moneysaver-acdd1.appspot.com/o/icons%2F5.png?alt=media&token=252b3930-c82b-458e-a432-8504cd1cf2d9',
        type: 0,
        parent: grparent1._id,
        fromId: fromId,
        walletId: walletId
    });
    let grchil2_1 = new Group({
        name: 'Câu cá',
        image: 'https://firebasestorage.googleapis.com/v0/b/moneysaver-acdd1.appspot.com/o/icons%2F22.png?alt=media&token=0eace963-58e5-47fd-8497-7f419a10625c',
        type: 0,
        parent: grparent2._id,
        fromId: fromId,
        walletId: walletId
    });
    let grchil2_2 = new Group({
        name: 'Golf',
        image: 'https://firebasestorage.googleapis.com/v0/b/moneysaver-acdd1.appspot.com/o/icons%2F16.png?alt=media&token=0ca50195-e2a6-4b3e-8a66-9b5151aa694c',
        type: 0,
        parent: grparent2._id,
        fromId: fromId,
        walletId: walletId
    });
    let grchil2_3 = new Group({
        name: 'Karaoke',
        image: 'https://firebasestorage.googleapis.com/v0/b/moneysaver-acdd1.appspot.com/o/icons%2F28.png?alt=media&token=0214955d-638a-47be-aa18-165a6a3af957',
        type: 0,
        parent: grparent2._id,
        fromId: fromId,
        walletId: walletId
    });

    await Promise.all([
        grparent1.save(), grparent2.save(), 
        grchil1_1.save(), grchil1_2.save(), grchil1_3.save(), 
        grchil2_1.save(), grchil2_2.save(), grchil2_3.save()
    ])
}

async function GroupThuDefault(fromId, walletId) {
    let gr1 = new Group({
        name: 'Lương',
        image: 'https://firebasestorage.googleapis.com/v0/b/moneysaver-acdd1.appspot.com/o/icons%2F40.png?alt=media&token=70ccb989-558b-4999-9772-ab5d8b5df2f5',
        type: 1,
        fromId: fromId,
        walletId: walletId
    });
    gr1.parent = gr1._id

    let gr2 = new Group({
        name: 'Xổ số',
        image: 'https://firebasestorage.googleapis.com/v0/b/moneysaver-acdd1.appspot.com/o/icons%2F50.png?alt=media&token=b47c3b39-6258-43a1-b713-e463c3b0f4e3',
        type: 1,
        fromId: fromId,
        walletId: walletId
    });
    gr2.parent = gr2._id

    let gr3 = new Group({
        name: 'Tiết kiệm',
        image: 'https://firebasestorage.googleapis.com/v0/b/moneysaver-acdd1.appspot.com/o/icons%2F34.png?alt=media&token=3994af42-12d8-41df-af81-502695274418',
        type: 1,
        fromId: fromId,
        walletId: walletId
    });
    gr3.parent = gr3._id

    let gr4 = new Group({
        name: 'Lãi',
        image: 'https://firebasestorage.googleapis.com/v0/b/moneysaver-acdd1.appspot.com/o/icons%2F9.png?alt=media&token=3ed9bb39-f015-4daa-9f27-5c713d03b6c0',
        type: 1,
        fromId: fromId,
        walletId: walletId
    });
    gr4.parent = gr4._id

    await Promise.all([gr1.save(), gr2.save(), gr3.save(), gr4.save()])
}

module.exports = {GroupChiDefault, GroupThuDefault}