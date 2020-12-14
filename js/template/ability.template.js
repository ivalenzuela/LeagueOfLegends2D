/* 
    ------- quy ước đặt tên class -------
    Đặt tên class theo đúng tên(tiếng anh) của chiêu thức muốn tạo
    Tên tiếng anh của chiêu thức thì vào xem trong từng tướng liên minh
    Danh sách tướng <https://leagueoflegends.fandom.com/wiki/List_of_champions>

    Ví dụ: Aatrox <https://leagueoflegends.fandom.com/wiki/Aatrox> có chiêu:
        Q: TheDarkinBlade
        W: InfernalChains
        E: UmbralDash
        R: WorldEnder

*/

class AbilityName extends AbilityCore {
    constructor(config = {}) {
        super(config);
        
        // override

        // custom attributes
    }

    // override
    preview() {}

    // override
    castSpell(destination) {}

    // override
    onStarted() {}

    // override
    onFinished() {}

    // override
    isAvailable() {}

    // other functions here
}