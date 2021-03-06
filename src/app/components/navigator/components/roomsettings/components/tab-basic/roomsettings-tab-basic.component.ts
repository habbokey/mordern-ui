import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavigatorCategoryDataParser } from '@nitrots/nitro-renderer';
import RoomSettings from '../../common/RoomSettings';

@Component({
    selector: 'nitro-navigator-roomsettings-tab-basic-component',
    templateUrl: './roomsettings-tab-basic.template.html'
})
export class NavigatorRoomSettingsTabBasicComponent
{
    @Input()
    public roomSettings: RoomSettings;

    @Input()
    public categories: NavigatorCategoryDataParser[];

    @Input()
    public maxVisitors: number[];

    @Input()
    public tradeSettings: string[];

    @Output()
    public onSave: EventEmitter<any> = new EventEmitter();

    @Output()
    public onDeleteRoom: EventEmitter<any> = new EventEmitter();

    constructor()
    {}

    public save(): void
    {
        this.onSave.emit(this.roomSettings);
    }

    public deleteRoom(): void
    {
        this.onDeleteRoom.emit();
    }
}
