from django.shortcuts import render
# from django.views import generic
# from django.http import HttpResponseRedirect, HttpResponse

# For WebRTC tests
import base64
import re
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages

from shared.utils import *
from item.models import Item

# Create your views here.
def index(request):
    context = {}
    return render(request, 'home/index.html', context)

def faq(request):
    context = {}
    return render(request, 'home/faq.html', context)

def about(request):
    context = {}
    return render(request, 'home/about.html', context)

def myAccount(request):
    if fn_isUserLoggedIn(request) == False:
        messages.error(request, "I think you forgot to login first.")
        return redirect("/login")

    qry_selectSaleItems = Item.objects.filter(user_id=request.session['user_id']).filter(itemWanted=False).order_by("-item_id")
    qry_selectWantedItems = Item.objects.filter(user_id=request.session['user_id']).filter(itemWanted=True).order_by("-item_id")

    context = {
        'qry_selectSaleItems': qry_selectSaleItems,
        'qry_selectWantedItems': qry_selectWantedItems
    }
    return render(request, 'home/myAccount.html', context)

# For WebRTC tests
def webRTC(request):
    context = {}

    return render(request, 'home/webRTC.html', context)

@csrf_exempt
def ajax_uploadSnapshot(request):
    snapshotInfo = {}

    filePath = os.path.join(os.getcwd(), 'static/webRTC')

    snapshotData = request.POST['image']

    snapshotData = snapshotData.replace("data:image/png;base64,", "")
    imgdata = base64.b64decode(snapshotData)

    filename = filePath + '/' + 'snapshot.png'
    image = open(filename, "wb")
    image.write(imgdata)
    image.close()

    snapshotInfo['success'] = True
    snapshotInfo['url'] = '/webRTC/snapshot.png'
    return JsonResponse(snapshotInfo, safe=False)
