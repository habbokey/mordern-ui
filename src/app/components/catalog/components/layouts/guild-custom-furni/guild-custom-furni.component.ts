import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { CatalogPageMessageOfferData, CatalogPageMessageProductData, HabboGroupEntryData, IFurnitureData, Nitro, StringDataType } from '@nitrots/nitro-renderer';
import { CatalogLayout } from '../../../CatalogLayout';
import { ProductTypeEnum } from '../../../enums/ProductTypeEnum';
import { CatalogService } from '../../../services/catalog.service';
import { MarketplaceService } from '../../../services/marketplace.service';

@Component({
    templateUrl: './guild-custom-furni.template.html'
})
export class CatalogLayoutGuildCustomFurniComponent extends CatalogLayout implements OnInit, OnDestroy
{
    public static CODE: string = 'guild_custom_furni';

    private _groups: HabboGroupEntryData[] = [];
    private _selectedGroupId: string = null;
    private _selectedGroup: HabboGroupEntryData = null;

    private _lastOfferSelected: CatalogPageMessageOfferData = null;

    constructor(
        protected _catalogService: CatalogService,
        protected _marketService: MarketplaceService,
        protected _ngZone: NgZone)
    {
        super(_catalogService, _marketService, _ngZone);
        _catalogService.registerGroupFurniTemplate(this);
    }

    ngOnInit(): void
    {
        this._catalogService.requestGroups();
    }

    ngOnDestroy(): void
    {
        this._catalogService.component.previewStuffData = null;
    }

    public selectOffer(offer: CatalogPageMessageOfferData): void
    {
        if(!offer)
        {
            this._catalogService.component.selectOffer(null);
            return;
        }

        this._lastOfferSelected = offer;

        const productData = [];
        productData.push('0');
        productData.push(this.selectedGroupId);
        productData.push(this._selectedGroup.badgeCode);
        productData.push(this.selectedGroupColorA);
        productData.push(this.selectedGroupColorB);

        const stringDataType = new StringDataType();
        stringDataType.setValue(productData);

        if(this._catalogService.component)
        {
            this._catalogService.component.previewStuffData = stringDataType;
            this._catalogService.component.selectOffer(offer);
        }
    }

    public getFirstProduct(offer: CatalogPageMessageOfferData): CatalogPageMessageProductData
    {
        return ((offer && offer.products[0]) || null);
    }

    public hasMultipleProducts(offer: CatalogPageMessageOfferData): boolean
    {
        return (offer.products.length > 1);
    }

    public offerName(offer: CatalogPageMessageOfferData): string
    {
        let key = '';

        const product = this.getFirstProduct(offer);

        if(product)
        {
            switch(product.productType)
            {
                case ProductTypeEnum.FLOOR:
                    key = 'roomItem.name.' + product.furniClassId;
                    break;
                case ProductTypeEnum.WALL:
                    key = 'wallItem.name.' + product.furniClassId;
                    break;
            }
        }

        if(key === '') return key;

        return Nitro.instance.getLocalization(key);
    }

    public getProductFurniData(product: CatalogPageMessageProductData): IFurnitureData
    {
        if(!product) return null;

        return this._catalogService.getFurnitureDataForProductOffer(product);
    }

    public offerImage(offer: CatalogPageMessageOfferData): string
    {
        if(!offer) return '';

        const product = offer.products[0];

        if(!product) return '';

        const furniData = this.getProductFurniData(product);

        if(!furniData) return '';

        switch(product.productType)
        {
            case ProductTypeEnum.FLOOR:
                return this._catalogService.getFurnitureDataIconUrl(furniData);
            case ProductTypeEnum.WALL:
                return this._catalogService.getFurnitureDataIconUrl(furniData);
        }

        return '';
    }

    public offerCount(offer: CatalogPageMessageOfferData): number
    {
        if(!this.hasMultipleProducts(offer))
        {
            const product = this.getFirstProduct(offer);

            if(product) return product.productCount;
        }

        return 1;
    }

    public get groups(): HabboGroupEntryData[]
    {
        return this._groups;
    }

    public set groups(groups: HabboGroupEntryData[])
    {
        this._groups = groups;

        if(groups.length > 0)
        {
            this._ngZone.run(() =>
            {
                this.selectedGroupId = groups[0].groupId.toString();
            });
        }
    }

    public get selectedGroup(): HabboGroupEntryData
    {
        return this._selectedGroup;
    }

    public get selectedGroupId(): string
    {
        return this._selectedGroupId;
    }

    public set selectedGroupId(groupId: string)
    {
        this._selectedGroupId = groupId;
        this._selectedGroup = this.groups.filter((group) => group.groupId.toString() === groupId)[0];
        this.selectOffer(null);
        this.selectOffer(this._lastOfferSelected);
    }

    public get selectedGroupColorA(): string
    {
        if(!this._selectedGroup) return 'fff';

        return this._selectedGroup.colorA;
    }

    public get selectedGroupColorB(): string
    {
        if(!this._selectedGroup) return 'fff';

        return this._selectedGroup.colorB;
    }
}
